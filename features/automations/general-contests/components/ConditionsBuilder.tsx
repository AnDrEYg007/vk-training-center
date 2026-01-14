
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ConditionGroup, ContestCondition, ConditionType } from '../types';

interface ConditionsBuilderProps {
    groups: ConditionGroup[];
    onChange: (groups: ConditionGroup[]) => void;
}

const CONDITION_TYPES: { type: ConditionType; label: string; icon: string }[] = [
    { type: 'like', label: 'Поставить лайк', icon: '❤️' },
    { type: 'repost', label: 'Сделать репост', icon: '📢' },
    { type: 'comment', label: 'Написать комментарий', icon: '💬' },
    { type: 'subscription', label: 'Быть подписчиком', icon: '👥' },
    { type: 'member_of_group', label: 'Спонсор (вступление в группу)', icon: '🤝' },
    { type: 'mailing', label: 'Подписка на рассылку', icon: '📩' },
];

const extractGroupIdFromUrl = (input: string): string => {
    if (!input) return '';
    // Если это просто число - возвращаем как есть
    if (/^\d+$/.test(input)) return input;
    
    // Если это полный URL или короткая ссылка
    try {
        // Убираем протокол и домен
        let clean = input.replace(/^(?:https?:\/\/)?(?:www\.)?(?:m\.)?vk\.com\//, '');
        // Убираем query параметры
        clean = clean.split('?')[0];
        // Убираем слэши
        clean = clean.replace(/\//g, '');
        
        // Проверяем стандартные префиксы
        if (clean.startsWith('public')) return clean.replace('public', '');
        if (clean.startsWith('club')) return clean.replace('club', '');
        if (clean.startsWith('event')) return clean.replace('event', '');
        
        // Если осталось что-то другое (например, короткое имя), возвращаем как есть
        // Бэкенд должен уметь резолвить screen_name, если это не числовой ID
        return clean;
    } catch (e) {
        return input;
    }
};

const AddConditionDropdown: React.FC<{ group: ConditionGroup; onAdd: (type: ConditionType) => void }> = ({ group, onAdd }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const timeoutRef = React.useRef<any>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300);
    };

    const availableTypes = CONDITION_TYPES.filter(ct => !group.conditions.some(c => c.type === ct.type));

    if (availableTypes.length === 0) return null;

    return (
        <div className="mt-3 relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 border border-dashed border-indigo-300 px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Добавить условие (И)
            </button>
            <div 
                className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-10 w-48 transition-all duration-200 ease-in-out origin-top-left ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            >
                {availableTypes.map(ct => (
                    <button
                        key={ct.type}
                        onClick={() => { onAdd(ct.type); setIsOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span>{ct.icon}</span> {ct.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const ConditionsBuilder: React.FC<ConditionsBuilderProps> = ({ groups, onChange }) => {

    const addGroup = () => {
        const newGroup: ConditionGroup = {
            id: uuidv4(),
            conditions: [{ id: uuidv4(), type: 'like' }] // Дефолтное условие
        };
        onChange([...groups, newGroup]);
    };

    const removeGroup = (groupId: string) => {
        onChange(groups.filter(g => g.id !== groupId));
    };

    const addCondition = (groupId: string, type: ConditionType) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    conditions: [...g.conditions, { id: uuidv4(), type }]
                };
            }
            return g;
        });
        onChange(newGroups);
    };

    const removeCondition = (groupId: string, conditionId: string) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                return {
                    ...g,
                    conditions: g.conditions.filter(c => c.id !== conditionId)
                };
            }
            return g;
        });
        // Удаляем группу, если в ней не осталось условий
        const cleanedGroups = newGroups.filter(g => g.conditions.length > 0);
        onChange(cleanedGroups);
    };

    const updateConditionParam = (groupId: string, conditionId: string, paramKey: string, value: string) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                const newConditions = g.conditions.map(c => {
                    if (c.id === conditionId) {
                        return { ...c, params: { ...c.params, [paramKey]: value } };
                    }
                    return c;
                });
                return { ...g, conditions: newConditions };
            }
            return g;
        });
        onChange(newGroups);
    };

    return (
        <div className="space-y-6">
            {groups.map((group, groupIndex) => (
                <div key={group.id} className="relative">
                    {/* Разделитель ИЛИ */}
                    {groupIndex > 0 && (
                        <div className="flex items-center justify-center my-4">
                            <div className="h-px bg-gray-300 w-full"></div>
                            <span className="px-3 text-xs font-bold text-gray-500 uppercase bg-gray-50">ИЛИ (Альтернатива)</span>
                            <div className="h-px bg-gray-300 w-full"></div>
                        </div>
                    )}

                    <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm relative group/card">
                        <div className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                             <button onClick={() => removeGroup(group.id)} className="text-red-400 hover:text-red-600 p-1" title="Удалить группу условий">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                             </button>
                        </div>
                        
                        <h4 className="text-sm font-bold text-indigo-900 mb-3">Вариант участия #{groupIndex + 1}</h4>
                        
                        <div className="space-y-2">
                            {group.conditions.map((condition, condIndex) => (
                                <div key={condition.id} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                                    <div className="flex-shrink-0 w-6 text-center text-lg">
                                        {CONDITION_TYPES.find(t => t.type === condition.type)?.icon}
                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-sm font-medium text-gray-700">
                                            {CONDITION_TYPES.find(t => t.type === condition.type)?.label}
                                        </span>
                                        
                                        {/* Параметры условия */}
                                        {condition.type === 'comment' && (
                                            <input 
                                                type="text" 
                                                placeholder="Содержит текст (необязательно)" 
                                                value={condition.params?.text_contains || ''}
                                                onChange={(e) => updateConditionParam(group.id, condition.id, 'text_contains', e.target.value)}
                                                className="ml-2 px-2 py-0.5 text-xs border border-gray-300 rounded w-40 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        )}
                                        {condition.type === 'member_of_group' && (
                                            <input 
                                                type="text" 
                                                placeholder="ID группы или ссылка" 
                                                value={condition.params?.group_id || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    // Пытаемся извлечь ID на лету, если пользователь вставил ссылку
                                                    // Но сохраняем возможность редактирования, поэтому если это похоже на ввод руками, не меняем резко
                                                    // Лучше всего обрабатывать при вставке или потере фокуса, но для реактивности сделаем простую очистку
                                                    // Если вставили полную ссылку - сразу парсим
                                                    if (val.includes('vk.com/')) {
                                                        updateConditionParam(group.id, condition.id, 'group_id', extractGroupIdFromUrl(val));
                                                    } else {
                                                        updateConditionParam(group.id, condition.id, 'group_id', val);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    // При потере фокуса точно парсим всё что есть
                                                    updateConditionParam(group.id, condition.id, 'group_id', extractGroupIdFromUrl(e.target.value));
                                                }}
                                                className="ml-2 px-2 py-0.5 text-xs border border-gray-300 rounded w-40 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                            />
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => removeCondition(group.id, condition.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Dropdown добавления условия */}
                        <AddConditionDropdown group={group} onAdd={(type) => addCondition(group.id, type)} />
                    </div>
                </div>
            ))}

            <button
                onClick={addGroup}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                Добавить вариант участия (ИЛИ)
            </button>
        </div>
    );
};
