import React from 'react';

/**
 * Mock-компоненты для демонстрации трёх типов постов в обучающем модуле
 * Визуально воспроизводят реальные карточки постов из календаря
 */

interface MockPostCardProps {
  type: 'published' | 'scheduled' | 'system';
  status?: 'pending_publication' | 'publishing' | 'possible_error' | 'error';
  postType?: 'regular' | 'contest_winner' | 'ai_feed' | 'general_contest_start' | 'general_contest_result';
  isCyclic?: boolean;
}

export const MockPostCard: React.FC<MockPostCardProps> = ({ 
  type, 
  status = 'pending_publication',
  postType = 'regular',
  isCyclic = false
}) => {
  // Определение визуальных характеристик по типу
  const isPublished = type === 'published';
  const isScheduled = type === 'scheduled';
  const isSystem = type === 'system';

  // Цвета рамки и фона для автоматизаций
  const automationBorderColors: Record<string, string> = {
    contest_winner: 'border-fuchsia-300 bg-fuchsia-50/40',
    ai_feed: 'border-indigo-300 bg-indigo-50/40',
    general_contest_start: 'border-sky-300 bg-sky-50/40',
    general_contest_result: 'border-orange-300 bg-orange-50/40',
  };

  // Бейджи для автоматизаций (соответствуют реальному PostCard)
  const getAutomationBadge = (postType: string) => {
    switch (postType) {
      case 'contest_winner':
        return (
          <div className="bg-fuchsia-100 text-fuchsia-700 rounded-full px-1.5 py-0.5 border border-fuchsia-200 shadow-sm flex items-center gap-1" title="Конкурс отзывов">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
          </div>
        );
      case 'ai_feed':
        return (
          <div className="bg-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 border border-indigo-200 shadow-sm flex items-center gap-1" title="Автоматическая AI генерация">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">AI Auto</span>
          </div>
        );
      case 'general_contest_start':
        return (
          <div className="bg-sky-100 text-sky-700 rounded-full px-1.5 py-0.5 border border-sky-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Старт">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
          </div>
        );
      case 'general_contest_result':
        return (
          <div className="bg-orange-100 text-orange-700 rounded-full px-1.5 py-0.5 border border-orange-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Итоги">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
            <span className="text-[9px] font-bold uppercase tracking-wider">Итоги</span>
          </div>
        );
      default:
        return null;
    }
  };

  // SVG иконки статусов системного поста (соответствуют реальному PostCard)
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_publication':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'publishing':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case 'possible_error':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
      case 'error':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
      default:
        return null;
    }
  };

  const borderStyle = isSystem 
    ? (postType !== 'regular' ? automationBorderColors[postType] : 'border-gray-400 border-dashed')
    : 'border-gray-200';

  const showAutomationBadge = isSystem && postType !== 'regular';
  const showStatusIcon = isSystem;

  return (
    <div className={`relative group rounded-lg border ${borderStyle} bg-white p-2.5 transition-all hover:shadow-md`}>
      {/* Полупрозрачный оверлей для опубликованных */}
      {isPublished && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 rounded-lg pointer-events-none group-hover:opacity-0 transition-opacity duration-300" />
      )}

      {/* Иконка опубликованного поста */}
      {isPublished && (
        <div className="absolute top-2 left-2 z-10 group-hover:opacity-0 transition-opacity duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      {/* Иконка статуса системного поста */}
      {showStatusIcon && (
        <div className="absolute top-2 left-2 z-10" title={`Статус: ${status}`}>
          {getStatusIcon(status)}
        </div>
      )}

      {/* Бейдж циклического поста */}
      {isCyclic && (
        <div className="absolute top-[-8px] right-[-8px] bg-indigo-100 text-indigo-600 rounded-full p-1 border border-indigo-200 shadow-sm z-10" title="Циклическая публикация">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      )}

      {/* Бейдж автоматизации */}
      {showAutomationBadge && (
        <div className="absolute top-[-8px] right-[-4px] z-10">
          {getAutomationBadge(postType)}
        </div>
      )}

      {/* Контент карточки */}
      <div className="relative z-0 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">
              {isPublished && 'Опубликованный пост'}
              {isScheduled && 'Отложенный пост VK'}
              {isSystem && postType === 'regular' && 'Системный пост'}
              {isSystem && postType === 'contest_winner' && 'Конкурс отзывов'}
              {isSystem && postType === 'ai_feed' && 'AI-лента'}
              {isSystem && postType === 'general_contest_start' && 'Старт конкурса'}
              {isSystem && postType === 'general_contest_result' && 'Итоги конкурса'}
            </div>
            <div className="text-xs text-gray-500 mt-1">12:00 • 15 февраля 2026</div>
          </div>
        </div>

        <div className="text-sm text-gray-700 line-clamp-3">
          Это пример текста поста для демонстрации визуальных различий между типами постов в календаре планировщика контента.
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>2 фото</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Новинки</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PostTypeComparisonProps {
  selectedType: 'published' | 'scheduled' | 'system';
  onTypeChange: (type: 'published' | 'scheduled' | 'system') => void;
}

export const PostTypeComparison: React.FC<PostTypeComparisonProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  const types = [
    { value: 'published' as const, label: 'Опубликованный', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'scheduled' as const, label: 'Отложенный VK', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'system' as const, label: 'Системный', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  ];

  return (
    <div className="space-y-4">
      {/* Переключатель типов */}
      <div className="flex gap-2 flex-wrap">
        {types.map(type => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
              selectedType === type.value
                ? type.color
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
            aria-pressed={selectedType === type.value}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Демонстрационная карточка */}
      <div className="max-w-md">
        <MockPostCard type={selectedType} />
      </div>

      {/* Описание выбранного типа */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Характеристики:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          {selectedType === 'published' && (
            <>
              <li>✅ Зелёная галочка в левом верхнем углу (исчезает при наведении)</li>
              <li>📊 Сплошная серая рамка с полупрозрачным оверлеем (горизонтальный градиент)</li>
              <li>📤 Уже опубликован на стене ВКонтакте</li>
              <li>✏️ Можно редактировать и удалять через API ВКонтакте</li>
              <li>📋 Можно копировать (создаёт системный пост)</li>
            </>
          )}
          {selectedType === 'scheduled' && (
            <>
              <li>📅 Сплошная серая рамка без иконок</li>
              <li>⏰ Запланирован через отложенную публикацию ВКонтакте</li>
              <li>✏️ Можно редактировать и удалять через API VK</li>
              <li>🔄 Можно перетаскивать на другие даты</li>
              <li>📋 Можно копировать</li>
            </>
          )}
          {selectedType === 'system' && (
            <>
              <li>⚡ Пунктирная серая рамка</li>
              <li>🕒 Иконка статуса в левом верхнем углу</li>
              <li>🏠 Создан и управляется внутри приложения</li>
              <li>✏️ Полное редактирование и удаление</li>
              <li>🔄 Можно перетаскивать, копировать, публиковать</li>
              <li>⚙️ Поддержка автоматизаций и циклических публикаций</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

interface SystemPostStatusDemoProps {
  selectedStatus: 'pending_publication' | 'publishing' | 'possible_error' | 'error';
  onStatusChange: (status: 'pending_publication' | 'publishing' | 'possible_error' | 'error') => void;
}

export const SystemPostStatusDemo: React.FC<SystemPostStatusDemoProps> = ({
  selectedStatus,
  onStatusChange
}) => {
  const statuses = [
    { value: 'pending_publication' as const, label: 'Ожидает публикации', icon: '🕒', color: 'bg-blue-100 text-blue-700' },
    { value: 'publishing' as const, label: 'Публикуется', icon: '⚙️', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'possible_error' as const, label: 'Возможная ошибка', icon: '⚠️', color: 'bg-orange-100 text-orange-700' },
    { value: 'error' as const, label: 'Ошибка', icon: '❌', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="space-y-4">
      {/* Переключатель статусов */}
      <div className="grid grid-cols-2 gap-2">
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => onStatusChange(status.value)}
            className={`px-3 py-2 rounded-lg font-medium transition-all ${
              selectedStatus === status.value
                ? status.color + ' ring-2 ring-offset-2 ring-gray-400'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
            }`}
            aria-pressed={selectedStatus === status.value}
          >
            <span aria-hidden="true">{status.icon}</span> {status.label}
          </button>
        ))}
      </div>

      {/* Демонстрационная карточка */}
      <div className="max-w-md">
        <MockPostCard type="system" status={selectedStatus} />
      </div>
    </div>
  );
};

interface AutomationTypeDemoProps {
  selectedAutomation: 'regular' | 'contest_winner' | 'ai_feed' | 'general_contest_start' | 'general_contest_result';
  onAutomationChange: (type: 'regular' | 'contest_winner' | 'ai_feed' | 'general_contest_start' | 'general_contest_result') => void;
}

export const AutomationTypeDemo: React.FC<AutomationTypeDemoProps> = ({
  selectedAutomation,
  onAutomationChange
}) => {
  const automations = [
    { value: 'regular' as const, label: 'Обычный', color: 'bg-gray-100 text-gray-700' },
    { value: 'contest_winner' as const, label: 'Конкурс отзывов', color: 'bg-fuchsia-100 text-fuchsia-700' },
    { value: 'ai_feed' as const, label: 'AI-лента', color: 'bg-indigo-100 text-indigo-700' },
    { value: 'general_contest_start' as const, label: 'Старт конкурса', color: 'bg-sky-100 text-sky-700' },
    { value: 'general_contest_result' as const, label: 'Итоги конкурса', color: 'bg-orange-100 text-orange-700' },
  ];

  return (
    <div className="space-y-4">
      {/* Переключатель типов */}
      <div className="grid grid-cols-2 gap-2">
        {automations.map(auto => (
          <button
            key={auto.value}
            onClick={() => onAutomationChange(auto.value)}
            className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
              selectedAutomation === auto.value
                ? auto.color + ' ring-2 ring-offset-2 ring-gray-400'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400'
            }`}
            aria-pressed={selectedAutomation === auto.value}
          >
            {auto.label}
          </button>
        ))}
      </div>

      {/* Демонстрационная карточка */}
      <div className="max-w-md">
        <MockPostCard type="system" postType={selectedAutomation} />
      </div>
    </div>
  );
};
