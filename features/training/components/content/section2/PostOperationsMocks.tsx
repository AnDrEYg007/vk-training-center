import React, { useState } from 'react';

// =====================================================================
// Mock-компоненты для раздела "Операции с постами"
// =====================================================================

// =====================================================================
// Компонент: Кнопка создания поста «+»
// =====================================================================
export const MockCreateButton: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="text-xs text-gray-500 mb-2 text-center">Колонка дня в календаре</div>
            <button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-full flex justify-center items-center p-3 border-2 border-dashed rounded-lg transition-colors duration-200 ${
                    isHovered
                        ? 'border-indigo-400 text-indigo-500'
                        : 'border-gray-300 text-gray-400'
                }`}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
            <div className="text-xs text-gray-500 mt-2 text-center">
                {isHovered ? 'Создать пост' : 'Наведите курсор'}
            </div>
        </div>
    );
};

// =====================================================================
// Компонент: Карточка поста с кнопками действий
// =====================================================================
interface MockPostCardProps {
    showActions?: boolean;
    postType?: 'scheduled' | 'published' | 'system';
}

export const MockPostCard: React.FC<MockPostCardProps> = ({ 
    showActions = true, 
    postType = 'scheduled' 
}) => {
    const [hoveredAction, setHoveredAction] = useState<string | null>(null);

    const actions = [
        { id: 'publish', icon: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8', label: 'Опубликовать', show: postType !== 'published' },
        { id: 'edit', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z', label: 'Редактировать', show: true },
        { id: 'copy', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Копировать', show: true },
        { id: 'delete', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', label: 'Удалить', show: true },
    ].filter(a => a.show);

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
                <img
                    src="https://picsum.photos/seed/post1/80/80"
                    alt="Превью"
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 line-clamp-2">
                        Пример текста поста для демонстрации карточки с действиями
                    </p>
                    <p className="text-xs text-gray-500 mt-2">14 февраля, 10:00</p>
                </div>
            </div>

            {showActions && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onMouseEnter={() => setHoveredAction(action.id)}
                            onMouseLeave={() => setHoveredAction(null)}
                            className={`p-1 rounded-full transition-colors ${
                                hoveredAction === action.id
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-400'
                            }`}
                            title={action.label}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                            </svg>
                        </button>
                    ))}
                </div>
            )}

            {hoveredAction && (
                <div className="text-xs text-indigo-600 mt-2 text-center">
                    {actions.find(a => a.id === hoveredAction)?.label}
                </div>
            )}
        </div>
    );
};

// =====================================================================
// Компонент: Переключатель способа публикации
// =====================================================================
export const MockPublicationMethodToggle: React.FC = () => {
    const [method, setMethod] = useState<'deferred' | 'vk' | 'now'>('deferred');

    const methods = [
        { id: 'deferred' as const, label: 'Запланировать', disabled: false },
        { id: 'vk' as const, label: 'В отложку VK', disabled: false },
        { id: 'now' as const, label: 'Опубликовать сейчас', disabled: false },
    ];

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="text-sm font-medium text-gray-700 mb-3">Способ публикации</div>
            <div className="flex gap-2">
                {methods.map((m) => (
                    <button
                        key={m.id}
                        onClick={() => !m.disabled && setMethod(m.id)}
                        disabled={m.disabled}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                            method === m.id
                                ? 'bg-white shadow text-indigo-700'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        } ${m.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {m.label}
                    </button>
                ))}
            </div>
            <div className="text-xs text-gray-500 mt-3">
                Выбрано: <span className="font-semibold">{methods.find(m => m.id === method)?.label}</span>
            </div>
        </div>
    );
};

// =====================================================================
// Компонент: Drag-and-Drop демонстрация
// =====================================================================
export const MockDragAndDrop: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOver, setDragOver] = useState<'zone1' | 'zone2' | null>(null);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Карточка для перетаскивания */}
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
                <div className="text-xs text-gray-500 mb-2">Исходная карточка</div>
                <div
                    draggable
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => {
                        setIsDragging(false);
                        setDragOver(null);
                    }}
                    className={`border-2 border-dashed border-indigo-300 rounded-lg p-3 cursor-move transition-all ${
                        isDragging ? 'opacity-50 scale-95' : ''
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <img
                            src="https://picsum.photos/seed/drag1/40/40"
                            alt="Пост"
                            className="w-10 h-10 rounded"
                        />
                        <div className="flex-1">
                            <p className="text-xs text-gray-700">Пост для переноса</p>
                            <p className="text-xs text-gray-500">14 фев, 10:00</p>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Перетащите в одну из зон →</div>
            </div>

            {/* Зоны для сброса */}
            <div className="space-y-3">
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver('zone1');
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={() => {
                        setDragOver(null);
                        setIsDragging(false);
                    }}
                    className={`border-2 border-dashed rounded-lg p-3 transition-colors ${
                        dragOver === 'zone1'
                            ? 'bg-indigo-100 border-indigo-400'
                            : 'bg-gray-50 border-gray-300'
                    }`}
                >
                    <p className="text-xs text-gray-600 text-center">15 февраля</p>
                </div>
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver('zone2');
                    }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={() => {
                        setDragOver(null);
                        setIsDragging(false);
                    }}
                    className={`border-2 border-dashed rounded-lg p-3 transition-colors ${
                        dragOver === 'zone2'
                            ? 'bg-indigo-100 border-indigo-400'
                            : 'bg-gray-50 border-gray-300'
                    }`}
                >
                    <p className="text-xs text-gray-600 text-center">16 февраля</p>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Компонент: Массовый выбор постов
// =====================================================================
export const MockBulkSelection: React.FC = () => {
    const [selectionMode, setSelectionMode] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);

    const posts = [1, 2, 3];

    const toggleSelection = (id: number) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-4">
            {/* Кнопка режима выбора */}
            <div className="flex justify-end">
                <button
                    onClick={() => {
                        setSelectionMode(!selectionMode);
                        setSelected([]);
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                        selectionMode
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {selectionMode ? 'Отмена' : 'Выбрать'}
                </button>
            </div>

            {/* Посты */}
            <div className="space-y-2">
                {posts.map((id) => (
                    <div
                        key={id}
                        onClick={() => selectionMode && toggleSelection(id)}
                        className={`relative border rounded-lg p-3 transition-all ${
                            selectionMode ? 'cursor-pointer' : ''
                        } ${
                            selected.includes(id)
                                ? 'ring-2 ring-indigo-500 border-transparent bg-indigo-50'
                                : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                    >
                        {selectionMode && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-sm border border-gray-300 bg-white flex items-center justify-center">
                                {selected.includes(id) && (
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://picsum.photos/seed/bulk${id}/60/60`}
                                alt="Пост"
                                className="w-15 h-15 rounded"
                            />
                            <div>
                                <p className="text-sm text-gray-700">Пост {id}</p>
                                <p className="text-xs text-gray-500">14 фев, 10:00</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Панель действий */}
            {selectionMode && selected.length > 0 && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                        Выбрано: {selected.length}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelected([])}
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Снять выделение
                        </button>
                        <button
                            className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// Компонент: Футер модального окна с кнопкой сохранения
// =====================================================================
interface MockModalFooterProps {
    variant?: 'create' | 'edit' | 'view';
}

export const MockModalFooter: React.FC<MockModalFooterProps> = ({ variant = 'create' }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 2000);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                {variant === 'edit' && (
                    <button className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 border border-red-200">
                        Удалить
                    </button>
                )}
                
                {variant === 'view' && (
                    <button className="px-4 py-2 text-sm font-medium rounded-md text-green-600 hover:bg-green-100">
                        Опубликовать сейчас
                    </button>
                )}

                <div className={`flex gap-3 ${variant === 'create' ? 'w-full justify-end' : ''}`}>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center min-w-[120px]"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            variant === 'create' ? 'Запланировать' : 'Сохранить'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Компонент: Toggle-переключатель
// =====================================================================
interface MockToggleProps {
    label: string;
    description?: string;
}

export const MockToggle: React.FC<MockToggleProps> = ({ label, description }) => {
    const [isOn, setIsOn] = useState(false);

    return (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-gray-700">{label}</div>
                    {description && (
                        <div className="text-xs text-gray-500 mt-1">{description}</div>
                    )}
                </div>
                <button
                    onClick={() => setIsOn(!isOn)}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                        isOn ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            isOn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
        </div>
    );
};

// =====================================================================
// Компонент: Статусы постов с иконками
// =====================================================================
export const MockPostStatuses: React.FC = () => {
    const statuses = [
        {
            type: 'scheduled',
            label: 'Запланированный',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-gray-500',
            bg: 'bg-gray-100'
        },
        {
            type: 'published',
            label: 'Опубликованный',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            color: 'text-green-600',
            bg: 'bg-green-100'
        },
        {
            type: 'error',
            label: 'Ошибка публикации',
            icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z',
            color: 'text-red-500',
            bg: 'bg-red-100'
        },
    ];

    return (
        <div className="space-y-3">
            {statuses.map((status) => (
                <div key={status.type} className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${status.bg} flex items-center justify-center`}>
                        <svg className={`w-5 h-5 ${status.color}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d={status.icon} clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-700">{status.label}</div>
                        <div className="text-xs text-gray-500">Пример отображения статуса</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
