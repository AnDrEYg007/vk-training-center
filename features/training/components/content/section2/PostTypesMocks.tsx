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

  // Цвета рамки для автоматизаций
  const automationBorderColors: Record<string, string> = {
    contest_winner: 'border-fuchsia-400',
    ai_feed: 'border-indigo-400',
    general_contest_start: 'border-sky-400',
    general_contest_result: 'border-orange-400',
  };

  // Бейджи для автоматизаций
  const automationBadges: Record<string, { text: string; color: string }> = {
    contest_winner: { text: 'КОНКУРС', color: 'bg-fuchsia-500' },
    ai_feed: { text: 'AI AUTO', color: 'bg-indigo-500' },
    general_contest_start: { text: 'КОНКУРС', color: 'bg-sky-500' },
    general_contest_result: { text: 'ИТОГИ', color: 'bg-orange-500' },
  };

  // Иконки статусов системного поста
  const statusIcons: Record<string, { icon: string; color: string }> = {
    pending_publication: { icon: '🕒', color: 'bg-blue-100 text-blue-600' },
    publishing: { icon: '⚙️', color: 'bg-yellow-100 text-yellow-600' },
    possible_error: { icon: '⚠️', color: 'bg-orange-100 text-orange-600' },
    error: { icon: '❌', color: 'bg-red-100 text-red-600' },
  };

  const borderStyle = isSystem 
    ? (postType !== 'regular' ? automationBorderColors[postType] : 'border-gray-300 border-dashed')
    : 'border-gray-300';

  const showAutomationBadge = isSystem && postType !== 'regular' && automationBadges[postType];
  const showStatusIcon = isSystem;

  return (
    <div className={`relative rounded-lg border-2 ${borderStyle} bg-white p-4 transition-all hover:shadow-md`}>
      {/* Полупрозрачный оверлей для опубликованных */}
      {isPublished && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/40 rounded-lg pointer-events-none" />
      )}

      {/* Иконка опубликованного поста */}
      {isPublished && (
        <div className="absolute top-2 left-2 z-10">
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}

      {/* Иконка статуса системного поста */}
      {showStatusIcon && (
        <div className="absolute top-2 left-2 z-10">
          <div className={`h-7 w-7 rounded-full ${statusIcons[status].color} flex items-center justify-center text-sm font-semibold`}>
            <span aria-label={`Статус: ${status}`}>{statusIcons[status].icon}</span>
          </div>
        </div>
      )}

      {/* Бейдж циклического поста */}
      {isCyclic && (
        <div className="absolute top-2 right-2 z-10">
          <div className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1">
            <span aria-hidden="true">🔄</span>
            <span>Циклический</span>
          </div>
        </div>
      )}

      {/* Бейдж автоматизации */}
      {showAutomationBadge && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`px-2 py-1 rounded ${automationBadges[postType].color} text-white text-xs font-semibold`}>
            {automationBadges[postType].text}
          </div>
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
              <li>✅ Зелёная галочка в левом верхнем углу</li>
              <li>📊 Сплошная серая рамка с полупрозрачным оверлеем</li>
              <li>📤 Уже опубликован на стене ВКонтакте</li>
              <li>🔒 Редактирование и удаление только через ВКонтакте</li>
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
