import React, { useState } from 'react';

/**
 * Mock-компоненты для обучающей страницы "Системный пост"
 * Все элементы интерфейса взяты из реального кода PostCard.tsx
 */

// =====================================================================
// Интерактивная карточка системного поста
// =====================================================================
interface MockSystemPostCardProps {
  status?: 'pending_publication' | 'publishing' | 'possible_error' | 'error';
  isCyclic?: boolean;
}

export const MockSystemPostCard: React.FC<MockSystemPostCardProps> = ({ 
  status = 'pending_publication',
  isCyclic = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Реальные SVG-иконки из PostCard.tsx (строки 319-324)
  const statusIcons = {
    pending_publication: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    publishing: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    possible_error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group p-2.5 rounded-lg border border-dashed border-gray-400 bg-white shadow-sm text-xs hover:shadow-md transition-all duration-200 cursor-move max-w-sm"
    >
      {/* Иконка цикличности (строка 174-181) */}
      {isCyclic && (
        <div className="absolute top-[-8px] right-[-8px] bg-indigo-100 text-indigo-600 rounded-full p-1 border border-indigo-200 shadow-sm z-10" title="Циклическая публикация">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )}

      {/* Иконка статуса (строка 307) */}
      <div className="absolute top-2 left-2 pointer-events-none">
        {statusIcons[status]}
      </div>

      {/* Заголовок с кнопками действий */}
      <div className="flex justify-between items-center mb-1 pl-7">
        <p className="font-semibold text-gray-500">10:00</p>
        
        {/* Кнопки действий (показываются при наведении) */}
        {isHovered && (
          <div className="flex items-center space-x-1">
            <button className="p-1 rounded-full text-gray-400 hover:text-indigo-600 transition-colors" title="Опубликовать">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
            <button className="p-1 rounded-full text-gray-400 hover:text-indigo-600 transition-colors" title="Редактировать">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button className="p-1 rounded-full text-gray-400 hover:text-indigo-600 transition-colors" title="Удалить">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Превью изображения */}
      <div className="mb-2 rounded overflow-hidden">
        <img src="https://picsum.photos/seed/system1/400/200" alt="Превью" className="w-full h-24 object-cover" />
      </div>

      {/* Текст поста */}
      <p className="text-gray-800 break-words overflow-hidden max-h-5 mt-2">
        Системный пост планируется приложением и публикуется автоматически в указанное время через бэкенд.
      </p>
    </div>
  );
};

// =====================================================================
// Демонстрация статусов системного поста
// =====================================================================
export const SystemPostStatusDemo: React.FC = () => {
  const [status, setStatus] = useState<'pending_publication' | 'publishing' | 'possible_error' | 'error'>('pending_publication');

  const statuses = [
    { id: 'pending_publication' as const, label: 'Ожидает публикации', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    { id: 'publishing' as const, label: 'Публикуется', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { id: 'possible_error' as const, label: 'Возможная ошибка', color: 'bg-amber-100 text-amber-700 border-amber-300' },
    { id: 'error' as const, label: 'Ошибка', color: 'bg-red-100 text-red-700 border-red-300' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button
            key={s.id}
            onClick={() => setStatus(s.id)}
            className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${
              status === s.id ? s.color : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <MockSystemPostCard status={status} />
    </div>
  );
};

// =====================================================================
// Демонстрация циклических публикаций и призраков
// =====================================================================
export const CyclicPostDemo: React.FC = () => {
  const [showGhosts, setShowGhosts] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showGhosts}
            onChange={(e) => setShowGhosts(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Показать будущие повторы (призраки)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Реальный циклический пост */}
        <div>
          <p className="text-xs font-semibold text-gray-600 mb-2">Оригинал (реальный)</p>
          <MockSystemPostCard isCyclic={true} />
        </div>

        {/* Призраки */}
        {showGhosts && (
          <>
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Призрак через неделю</p>
              <div className="relative p-2.5 rounded-lg border border-indigo-200 border-dashed bg-gray-50 opacity-60 shadow-sm text-xs max-w-sm" title="Это будущий циклический пост.">
                <div className="absolute top-2 left-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex justify-between items-center mb-1 pl-7">
                  <p className="font-semibold text-gray-500">10:00</p>
                </div>
                <div className="mb-2 rounded overflow-hidden">
                  <img src="https://picsum.photos/seed/system1/400/200" alt="Превью" className="w-full h-24 object-cover" />
                </div>
                <p className="text-gray-800 break-words overflow-hidden max-h-5 mt-2">
                  Системный пост планируется приложением и публикуется автоматически...
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">Призрак через 2 недели</p>
              <div className="relative p-2.5 rounded-lg border border-indigo-200 border-dashed bg-gray-50 opacity-60 shadow-sm text-xs max-w-sm" title="Это будущий циклический пост.">
                <div className="absolute top-2 left-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex justify-between items-center mb-1 pl-7">
                  <p className="font-semibold text-gray-500">10:00</p>
                </div>
                <div className="mb-2 rounded overflow-hidden">
                  <img src="https://picsum.photos/seed/system1/400/200" alt="Превью" className="w-full h-24 object-cover" />
                </div>
                <p className="text-gray-800 break-words overflow-hidden max-h-5 mt-2">
                  Системный пост планируется приложением и публикуется автоматически...
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// Демонстрация доступных действий
// =====================================================================
export const SystemPostActionsDemo: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'publish',
      label: 'Опубликовать',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      description: 'Публикует пост немедленно через фоновую задачу, не дожидаясь запланированного времени.',
      color: 'bg-green-50 border-green-200 text-green-700',
    },
    {
      id: 'move',
      label: 'В отложку VK',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      description: 'Переносит пост в отложенные записи ВКонтакте. Публикация будет выполнена серверами VK.',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      id: 'edit',
      label: 'Редактировать',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      description: 'Открывает всплывающее окно с редактором: текст, дата, изображения, настройки цикличности.',
      color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    },
    {
      id: 'copy',
      label: 'Копировать',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Создаёт копию поста с выбором: системный, отложка VK или публикация сейчас.',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    {
      id: 'delete',
      label: 'Удалить',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      description: 'Удаляет пост из системы. Появится окно подтверждения.',
      color: 'bg-red-50 border-red-200 text-red-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => setSelectedAction(action.id)}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
              selectedAction === action.id ? action.color : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className={selectedAction === action.id ? '' : 'text-gray-400'}>
              {action.icon}
            </div>
            <span className="text-xs font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {selectedAction && (
        <div className={`p-4 rounded-lg border-2 ${actions.find(a => a.id === selectedAction)?.color}`}>
          <p className="text-sm font-semibold mb-2">
            {actions.find(a => a.id === selectedAction)?.label}
          </p>
          <p className="text-sm">
            {actions.find(a => a.id === selectedAction)?.description}
          </p>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Демонстрация бейджей автоматизаций
// =====================================================================
export const AutomationBadgesDemo: React.FC = () => {
  const badges = [
    {
      type: 'contest_winner',
      label: 'КОНКУРС',
      color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      borderClass: 'border-fuchsia-300',
      bgClass: 'bg-fuchsia-50/40',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      type: 'ai_feed',
      label: 'AI AUTO',
      color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      borderClass: 'border-indigo-300',
      bgClass: 'bg-indigo-50/40',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      type: 'general_contest_start',
      label: 'КОНКУРС',
      color: 'bg-sky-100 text-sky-700 border-sky-200',
      borderClass: 'border-sky-300',
      bgClass: 'bg-sky-50/40',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      type: 'general_contest_end',
      label: 'ИТОГИ',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      borderClass: 'border-orange-300',
      bgClass: 'bg-orange-50/40',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {badges.map(badge => (
        <div key={badge.type} className={`relative p-2.5 rounded-lg border ${badge.borderClass} ${badge.bgClass} shadow-sm text-xs max-w-sm`}>
          {/* Бейдж автоматизации */}
          <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1 z-10">
            <div className={`${badge.color} rounded-full px-1.5 py-0.5 border shadow-sm flex items-center gap-1`}>
              {badge.icon}
              <span className="text-[9px] font-bold uppercase tracking-wider">{badge.label}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-1">
            <p className={`font-semibold ${badge.type === 'contest_winner' ? 'text-fuchsia-800' : badge.type === 'ai_feed' ? 'text-indigo-800' : badge.type === 'general_contest_start' ? 'text-sky-800' : 'text-orange-800'}`}>
              10:00
            </p>
          </div>

          <div className="mb-2 rounded overflow-hidden">
            <img src={`https://picsum.photos/seed/${badge.type}/400/200`} alt="Превью" className="w-full h-24 object-cover" />
          </div>

          <p className="text-gray-800 break-words mt-2">
            Автоматический пост типа «{badge.label}»
          </p>
        </div>
      ))}
    </div>
  );
};

// =====================================================================
// Демонстрация жизненного цикла
// =====================================================================
export const LifecycleFlowDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { status: 'pending_publication', label: 'Ожидает публикации', description: 'Пост создан и ждёт наступления запланированного времени', color: 'bg-gray-100 border-gray-300' },
    { status: 'publishing', label: 'Публикуется', description: 'Пост-трекер начал публикацию и проверяет результат на стене VK', color: 'bg-blue-100 border-blue-300' },
    { status: 'published', label: 'Опубликован', description: 'Пост найден на стене VK и удалён из системных (если cyclic — создан новый)', color: 'bg-green-100 border-green-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => setCurrentStep(index)}
              className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                currentStep === index ? step.color + ' shadow-md' : 'bg-white border-gray-200 opacity-50'
              }`}
            >
              <p className="text-xs font-semibold text-center">{step.label}</p>
            </button>
            {index < steps.length - 1 && (
              <svg className="h-6 w-6 text-gray-400 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={`p-4 rounded-lg border-2 ${steps[currentStep].color}`}>
        <p className="text-sm font-semibold mb-2">{steps[currentStep].label}</p>
        <p className="text-sm text-gray-700">{steps[currentStep].description}</p>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg">
        <p className="text-xs text-gray-700">
          <strong>Альтернативные пути:</strong> Из статуса «Публикуется» возможен переход в «Возможная ошибка» (если пост не найден на стене {'>'} 5 минут) или «Ошибка» (при проблемах с API VK).
        </p>
      </div>
    </div>
  );
};

// =====================================================================
// Демонстрация действия "В отложку VK"
// =====================================================================
export const MoveToVkDemo: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'moving' | 'success'>('initial');

  const handleMove = () => {
    setStep('moving');
    setTimeout(() => setStep('success'), 2000);
  };

  const reset = () => setStep('initial');

  return (
    <div className="space-y-4">
      {step === 'initial' && (
        <>
          <div className="max-w-sm">
            <MockSystemPostCard />
          </div>
          <button
            onClick={handleMove}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Перенести в отложку VK
          </button>
        </>
      )}

      {step === 'moving' && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-blue-900">Переносим пост в отложенные записи VK...</span>
        </div>
      )}

      {step === 'success' && (
        <>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">Пост успешно перенесён!</p>
              <p className="text-xs text-green-700">Теперь это отложенная запись VK. Публикация будет выполнена серверами ВКонтакте.</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Попробовать снова
          </button>
        </>
      )}
    </div>
  );
};
