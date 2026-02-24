import React, { useState } from 'react';

/**
 * Mock-компоненты для обучающей страницы "Отложенный пост VK"
 * Визуально повторяют реальные карточки из PostCard.tsx
 */

// =====================================================================
// Mock: Карточка отложенного VK поста
// =====================================================================
export const MockDeferredPostCard: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm transition-all duration-200 cursor-move ${
        isHovered ? 'shadow-md' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Время */}
      <div className="text-xs text-gray-500 mb-2">14:30</div>
      
      {/* Текст поста */}
      <div className="text-sm text-gray-800 mb-3">
        Пример отложенного поста ВКонтакте. Этот пост запланирован через интерфейс VK и будет автоматически опубликован в указанное время.
      </div>

      {/* Изображение */}
      <div className="mb-3">
        <img 
          src="https://picsum.photos/seed/deferred/400/200" 
          alt="Mock" 
          className="w-full rounded-md"
        />
      </div>

      {/* Теги */}
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Новости</span>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Акции</span>
      </div>

      {/* Кнопки действий (при наведении) */}
      {isHovered && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-1 border border-gray-200">
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Опубликовать">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Редактировать">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Копировать">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Удалить">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Посмотреть на VK">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Mock: Интерактивная демонстрация перетаскивания
// =====================================================================
export const DragDropDemo: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrop = () => {
    setIsDragging(false);
    setShowDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Исходная ячейка */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
        <p className="text-sm text-gray-500 mb-2">Пятница, 15 февраля</p>
        <div 
          className={`transition-opacity ${isDragging ? 'opacity-30' : 'opacity-100'}`}
          onMouseDown={handleDragStart}
        >
          <MockDeferredPostCard />
        </div>
      </div>

      {/* Целевая ячейка */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50'
        }`}
        onMouseUp={handleDrop}
      >
        <p className="text-sm text-gray-500 mb-2">Суббота, 16 февраля</p>
        {isDragging && (
          <p className="text-xs text-indigo-600 text-center py-8">
            👆 Отпустите, чтобы переместить пост на эту дату
          </p>
        )}
      </div>

      {/* Диалог выбора действия */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDialog(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Переместить пост</h4>
            
            <div className="space-y-3 mb-6">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="action" defaultChecked className="text-indigo-600" />
                  <span className="text-sm text-gray-700">Перенести (старый пост удалится)</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="action" className="text-indigo-600" />
                  <span className="text-sm text-gray-700">Копировать</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Новая дата и время:</label>
                <input 
                  type="datetime-local" 
                  defaultValue="2026-02-16T14:30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                onClick={() => setShowDialog(false)}
              >
                Подтвердить
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
                onClick={() => setShowDialog(false)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Mock: Сравнение "Было/Стало"
// =====================================================================
export const BeforeAfterComparison: React.FC = () => {
  const [view, setView] = useState<'before' | 'after'>('before');

  return (
    <div className="space-y-4">
      {/* Переключатель */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setView('before')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            view === 'before' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ❌ Было (без приложения)
        </button>
        <button
          onClick={() => setView('after')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            view === 'after' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✅ Стало (с приложением)
        </button>
      </div>

      {/* Контент */}
      <div className="bg-white border border-gray-300 rounded-lg p-6">
        {view === 'before' ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">😓</span>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Управление отложенными постами раньше</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Заходить в каждое сообщество VK отдельно</li>
                  <li>• Искать раздел «Отложенные записи» в меню</li>
                  <li>• Вручную редактировать время через неудобный интерфейс VK</li>
                  <li>• Не видно отложенных постов других проектов</li>
                  <li>• Копировать пост в другие сообщества — снова руками через каждый аккаунт</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">✨</span>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Управление отложенными постами сейчас</p>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Все отложенные посты всех проектов — в одном календаре</li>
                  <li>• Перетащите пост на другую дату — время изменится автоматически</li>
                  <li>• Редактирование через удобное всплывающее окно с AI-генератором</li>
                  <li>• Копирование в несколько проектов одним действием</li>
                  <li>• Опубликовать раньше времени — одна кнопка</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================================
// Mock: Демонстрация действий с описаниями
// =====================================================================
export const ActionsDemo: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<'publish' | 'edit' | 'copy' | 'delete' | 'vk_link'>('edit');

  const actions = [
    { id: 'publish' as const, label: 'Опубликовать', icon: '✅', color: 'green' },
    { id: 'edit' as const, label: 'Редактировать', icon: '✏️', color: 'gray' },
    { id: 'copy' as const, label: 'Копировать', icon: '📋', color: 'gray' },
    { id: 'delete' as const, label: 'Удалить', icon: '🗑️', color: 'red' },
    { id: 'vk_link' as const, label: 'Посмотреть на VK', icon: '🔗', color: 'blue' },
  ];

  const descriptions = {
    publish: 'Немедленно публикует пост на стене ВКонтакте, не дожидаясь запланированного времени. Пост удаляется из отложенных и становится опубликованным. Процесс выполняется в фоновом режиме — статус публикации обновится через несколько секунд.',
    edit: 'Открывает всплывающее окно редактирования, где можно изменить текст, дату/время публикации, изображения и теги. Изменения применяются к оригинальному посту в отложенных записях ВКонтакте через API. Переключатель способа публикации (системный/отложка VK) не отображается, так как пост уже отложен в VK.',
    copy: 'Создаёт копию поста с возможностью выбора: сохранить как системный пост, отправить в отложку VK или опубликовать сразу. Также доступно мультипроектное создание — можно создать копию сразу в несколько проектов одним действием.',
    delete: 'Удаляет пост из отложенных записей ВКонтакте через API. Перед удалением отображается окно подтверждения с предупреждением. После удаления пост исчезнет из календаря и не будет опубликован в запланированное время.',
    vk_link: 'Открывает отложенный пост во ВКонтакте в новой вкладке браузера. Эта кнопка доступна только если у поста есть прямая ссылка на запись в VK (обычно формата vk.com/wall-XXXXXX_YYY?postponed=1). Позволяет проверить, как пост выглядит в интерфейсе ВКонтакте.',
  };

  return (
    <div className="space-y-4">
      {/* Кнопки выбора действия */}
      <div className="flex flex-wrap gap-2">
        {actions.map(action => (
          <button
            key={action.id}
            onClick={() => setSelectedAction(action.id)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedAction === action.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Описание выбранного действия */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {descriptions[selectedAction]}
        </p>
      </div>
    </div>
  );
};
