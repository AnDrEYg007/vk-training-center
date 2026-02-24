import React, { useState } from 'react';

/**
 * Mock-компоненты для раздела "Универсальные конкурсы"
 * Все элементы основаны на реальных компонентах из features/automations/general-contests/
 */

// =====================================================================
// Типы данных
// =====================================================================
type ContestStatus = 'awaiting_start' | 'running' | 'completed' | 'paused_no_codes' | 'paused_manual';
type ConditionType = 'like' | 'repost' | 'comment' | 'subscription' | 'member_of_group' | 'mailing';

interface MockContestCardProps {
  title: string;
  description?: string;
  status: ContestStatus;
  startDate: string;
  startTime: string;
  winnersCount: number;
  isCyclic: boolean;
  isActive: boolean;
  finishLabel: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ConditionItem {
  id: string;
  type: ConditionType;
  label: string;
  icon: string;
}

// =====================================================================
// Карточка конкурса (из GeneralContestCard.tsx)
// =====================================================================
export const MockContestCard: React.FC<MockContestCardProps> = ({
  title,
  description,
  status,
  startDate,
  startTime,
  winnersCount,
  isCyclic,
  isActive,
  finishLabel,
  onEdit,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Определение цвета и текста статуса (из реального GeneralContestCard.tsx)
  let statusLabel = 'Пауза';
  let statusColor = 'bg-gray-200 text-gray-600 border-gray-300';

  switch (status) {
    case 'awaiting_start':
      if (isActive) {
        statusLabel = 'Ожидает старта';
        statusColor = 'bg-yellow-50 text-yellow-700 border-yellow-200';
      } else {
        statusLabel = 'Ожидает старта (Выкл)';
        statusColor = 'bg-gray-100 text-gray-500 border-gray-200';
      }
      break;
    case 'running':
      statusLabel = 'Запущен';
      statusColor = 'bg-green-100 text-green-700 border-green-200 animate-pulse';
      break;
    case 'completed':
      statusLabel = 'Завершен';
      statusColor = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'paused_no_codes':
      statusLabel = 'Нет промокодов';
      statusColor = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'paused_manual':
    default:
      statusLabel = 'Выключен';
      statusColor = 'bg-gray-200 text-gray-600 border-gray-300';
      break;
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border flex flex-col h-full transition-all hover:shadow-md ${isActive ? 'border-indigo-100' : 'border-gray-200 bg-gray-50/50'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold truncate ${isActive ? 'text-gray-900' : 'text-gray-500'}`} title={title}>
              {title}
            </h3>
            {description ? (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
            ) : (
              <p className="text-xs text-gray-400 italic mt-1">Нет описания</p>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Info Bar */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-md border border-gray-100">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span><span className="font-medium text-gray-700">Старт:</span> {startDate} {startTime}</span>
          </div>
          <div className="h-3 w-px bg-gray-300"></div>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{finishLabel}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 space-y-3 bg-white">
          {/* Winners */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Победителей:</span>
            <span className="font-medium text-gray-900">{winnersCount}</span>
          </div>
          
          {/* Cyclic */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Цикличность:</span>
            <span className={`font-medium ${isCyclic ? 'text-indigo-600' : 'text-gray-400'}`}>
              {isCyclic ? 'Да' : 'Нет'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg flex justify-between items-center gap-2">
        <button 
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Редактировать
        </button>
        <button 
          onClick={onDelete}
          className="flex items-center justify-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Удалить"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
};

// =====================================================================
// Список условий (иконки из ConditionsBuilder.tsx)
// =====================================================================
export const CONDITION_TYPES: ConditionItem[] = [
  { id: 'like', type: 'like', label: 'Поставить лайк', icon: '❤️' },
  { id: 'repost', type: 'repost', label: 'Сделать репост', icon: '📢' },
  { id: 'comment', type: 'comment', label: 'Написать комментарий', icon: '💬' },
  { id: 'subscription', type: 'subscription', label: 'Быть подписчиком', icon: '👥' },
  { id: 'member_of_group', type: 'member_of_group', label: 'Спонсор (вступление в группу)', icon: '🤝' },
  { id: 'mailing', type: 'mailing', label: 'Подписка на рассылку', icon: '📩' },
];

// =====================================================================
// Конструктор условий (упрощенная версия ConditionsBuilder)
// =====================================================================
interface MockConditionsBuilderProps {
  selectedConditions?: ConditionType[];
  showGroupExample?: boolean;
}

export const MockConditionsBuilder: React.FC<MockConditionsBuilderProps> = ({ 
  selectedConditions = ['like', 'repost'], 
  showGroupExample = false 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayedConditions = CONDITION_TYPES.filter(ct => selectedConditions.includes(ct.type));
  const availableConditions = CONDITION_TYPES.filter(ct => !selectedConditions.includes(ct.type));

  return (
    <div className="space-y-6">
      {/* Группа 1 */}
      <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
        <h4 className="text-sm font-bold text-indigo-900 mb-3">Вариант участия #1</h4>
        
        <div className="space-y-2">
          {displayedConditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
              <div className="flex-shrink-0 w-6 text-center text-lg">
                {condition.icon}
              </div>
              <div className="flex-grow">
                <span className="text-sm font-medium text-gray-700">
                  {condition.label}
                </span>
              </div>
              <button className="text-gray-400 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Dropdown добавления условия */}
        {availableConditions.length > 0 && (
          <div className="mt-3 relative inline-block">
            <button 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setTimeout(() => setIsDropdownOpen(false), 300)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border border-dashed border-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Добавить условие (И)
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-48"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {availableConditions.map(ct => (
                  <button
                    key={ct.id}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span>{ct.icon}</span> {ct.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Группа 2 (для примера с ИЛИ) */}
      {showGroupExample && (
        <>
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-300 w-full"></div>
            <span className="px-3 text-xs font-bold text-gray-500 uppercase bg-gray-50">ИЛИ (Альтернатива)</span>
            <div className="h-px bg-gray-300 w-full"></div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-bold text-indigo-900 mb-3">Вариант участия #2</h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                <div className="flex-shrink-0 w-6 text-center text-lg">💬</div>
                <div className="flex-grow">
                  <span className="text-sm font-medium text-gray-700">Написать комментарий</span>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Кнопка добавления варианта */}
      <button
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
        Добавить вариант участия (ИЛИ)
      </button>
    </div>
  );
};

// =====================================================================
// Пустое состояние списка конкурсов
// =====================================================================
export const MockEmptyContestsList: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full p-10 text-center">
    <div className="mb-4 text-gray-300">
      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900">Нет конкурсов</h3>
    <p className="mt-1 text-sm text-gray-500">Создайте свой первый универсальный конкурс или розыгрыш.</p>
    <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Создать конкурс</button>
  </div>
);

// =====================================================================
// Табы редактора конкурса
// =====================================================================
interface MockEditorTabsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MockEditorTabs: React.FC<MockEditorTabsProps> = ({ 
  activeTab = 'settings',
  onTabChange 
}) => {
  const tabs = [
    { id: 'settings', label: 'Настройки' },
    { id: 'promocodes', label: 'Промокоды' },
    { id: 'participants', label: 'Участники' },
    { id: 'winners', label: 'Победители' },
    { id: 'sending_list', label: 'Отправка' },
    { id: 'blacklist', label: 'Чёрный список' },
  ];

  const tabClass = (tabId: string) => `px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
    activeTab === tabId 
      ? 'bg-white text-indigo-600 shadow-sm' 
      : 'text-gray-600 hover:bg-gray-300'
  }`;

  return (
    <div className="px-4 pt-2 flex-shrink-0">
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={tabClass(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// =====================================================================
// Бейджи типов постов конкурса (из PostTypesMocks.tsx)
// =====================================================================
export const MockContestStartBadge: React.FC = () => (
  <div className="bg-sky-100 text-sky-700 rounded-full px-1.5 py-0.5 border border-sky-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Старт">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
  </div>
);

export const MockContestResultBadge: React.FC = () => (
  <div className="bg-orange-100 text-orange-700 rounded-full px-1.5 py-0.5 border border-orange-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Итоги">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
    </svg>
    <span className="text-[9px] font-bold uppercase tracking-wider">Итоги</span>
  </div>
);
