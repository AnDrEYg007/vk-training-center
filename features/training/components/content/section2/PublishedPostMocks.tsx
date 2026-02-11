import React, { useState } from 'react';

/**
 * Mock-компоненты для демонстрации опубликованных постов в обучающем модуле
 * Визуально воспроизводят реальные карточки опубликованных постов из календаря
 */

// =====================================================================
// Mock-карточка опубликованного поста
// =====================================================================
interface MockPublishedPostCardProps {
  isHovered?: boolean;
}

export const MockPublishedPostCard: React.FC<MockPublishedPostCardProps> = ({ 
  isHovered = false 
}) => {
  return (
    <div className="relative group rounded-lg border border-gray-200 bg-white p-2.5 shadow-sm hover:shadow-md transition-all">
      {/* Полупрозрачный оверлей (исчезает при наведении) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 rounded-lg pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Зелёная галочка (исчезает при наведении) */}
      <div 
        className={`absolute top-2 left-2 z-10 transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-green-500 opacity-80" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Контент карточки */}
      <div className="relative z-0">
        <div className="flex items-start justify-between mb-2 pl-7">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">
              Опубликованный пост
            </div>
            <div className="text-xs text-gray-500 mt-1">14:30 • 8 февраля 2026</div>
          </div>
        </div>

        {/* Изображение */}
        <div className="mb-2 rounded overflow-hidden">
          <img 
            src="https://picsum.photos/seed/published-demo/400/200" 
            alt="Пример изображения" 
            className="w-full h-32 object-cover"
          />
        </div>

        <div className="text-sm text-gray-700 line-clamp-3">
          Это пример опубликованного поста. Обратите внимание на полупрозрачный оверлей и зелёную галочку в левом верхнем углу. При наведении курсора они исчезают, открывая полное содержимое публикации.
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>1 фото</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Акции</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Интерактивная демонстрация действий
// =====================================================================
type ActionId = 'edit' | 'delete' | 'copy' | 'vk_link';

interface ActionInfo {
  id: ActionId;
  label: string;
  description: string;
  icon: string;
}

const actions: ActionInfo[] = [
  {
    id: 'edit',
    label: 'Редактировать',
    description: 'Открывает модальное окно редактирования поста. После сохранения изменения применяются к оригинальному посту на стене ВКонтакте через метод API wall.edit.',
    icon: '✏️'
  },
  {
    id: 'delete',
    label: 'Удалить',
    description: 'Удаляет пост со стены ВКонтакте через метод API wall.delete и убирает его из локального кэша приложения. Требуется подтверждение действия.',
    icon: '🗑️'
  },
  {
    id: 'copy',
    label: 'Копировать',
    description: 'Открывает модальное окно с предзаполненной формой нового поста. По умолчанию копия создаётся как системный пост, который можно отредактировать и опубликовать позже.',
    icon: '📋'
  },
  {
    id: 'vk_link',
    label: 'Посмотреть на VK',
    description: 'Открывает пост на стене ВКонтакте в новой вкладке браузера. Доступно только если у поста есть поле vkPostUrl.',
    icon: '🔗'
  }
];

export const PublishedPostActionsDemo: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionId>('edit');

  const currentAction = actions.find(a => a.id === selectedAction);

  return (
    <div className="space-y-4">
      {/* Список кнопок действий */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => setSelectedAction(action.id)}
            className={`px-4 py-3 rounded-lg border-2 font-medium transition-all text-left ${
              selectedAction === action.id
                ? 'bg-indigo-100 border-indigo-500 text-indigo-900'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span className="mr-2" aria-hidden="true">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

      {/* Описание выбранного действия */}
      {currentAction && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <span aria-hidden="true">{currentAction.icon}</span>
            {currentAction.label}
          </h4>
          <p className="text-sm text-indigo-800">
            {currentAction.description}
          </p>
        </div>
      )}

      {/* Информация о скрытых действиях */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Скрытые действия:</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>❌ <strong>«Опубликовать сейчас»</strong> — пост уже опубликован</li>
          <li>❌ <strong>«В отложку ВК»</strong> — недоступно для опубликованных</li>
          <li>❌ <strong>«Подтвердить публикацию»</strong> — только для системных постов</li>
        </ul>
      </div>
    </div>
  );
};
