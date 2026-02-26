import React, { useState } from 'react';

// =====================================================================
// РЕАЛЬНЫЕ SVG-ИКОНКИ ИЗ ИСХОДНОГО КОДА ListCard.tsx
// =====================================================================

// Иконка: Группа людей (подписчики)
const UsersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// Иконка: Диалог с точками (рассылка, комментарии)
const MessageIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
);

// Иконка: Человек с плюсом (вступившие)
const UserPlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
);

// Иконка: Человек с минусом (вышедшие)
const UserMinusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
    </svg>
);

// Иконка: Сердце (лайки)
const HeartIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

// Иконка: Три круга со связями (репосты)
const ShareIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
);

// Иконка: Звезда (победители)
const StarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

// Иконка: Газета (посты)
const NewspaperIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);

// Иконка: Ручка (авторы)
const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

// Иконка: Трофей (победители конкурса)
const TrophyIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

// Иконка: Документ (история постов)
const DocumentIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

// Иконка: Перо (авторы)
const PenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

// =====================================================================
// ТИПЫ ДАННЫХ
// =====================================================================

export type ListType = 'subscribers' | 'mailing' | 'history_join' | 'history_leave' | 
    'likes' | 'comments' | 'reposts' | 'reviews_winners' | 'reviews_participants' | 
    'reviews_posts' | 'posts' | 'authors';

export type ListGroup = 'subscribers' | 'activities' | 'automations' | 'other';

interface ListCardData {
    type: ListType;
    group: ListGroup;
    title: string;
    count: number;
    vkCount?: number; // Для двойного счётчика (например, "1000 из 5400")
    lastUpdated?: string;
    icon: React.ReactNode;
    bgColor: string;
}

// =====================================================================
// РЕАЛЬНЫЕ ДАННЫЕ СПИСКОВ ИЗ ПРОЕКТА
// =====================================================================

const getListCardData = (): ListCardData[] => [
    // Группа: Подписчики
    {
        type: 'subscribers',
        group: 'subscribers',
        title: 'Подписчики',
        count: 12458,
        lastUpdated: '15 фев, 14:23',
        icon: <UsersIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-indigo-500'
    },
    {
        type: 'mailing',
        group: 'subscribers',
        title: 'В рассылке',
        count: 8932,
        lastUpdated: '15 фев, 10:15',
        icon: <MessageIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-cyan-600'
    },
    {
        type: 'history_join',
        group: 'subscribers',
        title: 'Вступившие',
        count: 342,
        lastUpdated: '14 фев, 18:45',
        icon: <UserPlusIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-teal-500'
    },
    {
        type: 'history_leave',
        group: 'subscribers',
        title: 'Вышедшие',
        count: 127,
        lastUpdated: '14 фев, 18:45',
        icon: <UserMinusIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-orange-500'
    },
    
    // Группа: Активности
    {
        type: 'likes',
        group: 'activities',
        title: 'Лайкали',
        count: 1543,
        lastUpdated: '10 фев, 12:00',
        icon: <HeartIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-pink-500'
    },
    {
        type: 'comments',
        group: 'activities',
        title: 'Комментировали',
        count: 789,
        lastUpdated: '10 фев, 12:00',
        icon: <MessageIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-blue-500'
    },
    {
        type: 'reposts',
        group: 'activities',
        title: 'Репостили',
        count: 234,
        lastUpdated: '10 фев, 12:00',
        icon: <ShareIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-purple-500'
    },
    
    // Группа: Автоматизации
    {
        type: 'reviews_winners',
        group: 'automations',
        title: 'Конкурс отзывов: Победители',
        count: 45,
        lastUpdated: '12 фев, 16:30',
        icon: <StarIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-amber-500'
    },
    {
        type: 'reviews_participants',
        group: 'automations',
        title: 'Конкурс отзывов: Участники',
        count: 523,
        lastUpdated: '12 фев, 16:30',
        icon: <UsersIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-green-500'
    },
    {
        type: 'reviews_posts',
        group: 'automations',
        title: 'Конкурс отзывов: Посты',
        count: 112,
        lastUpdated: '12 фев, 16:30',
        icon: <NewspaperIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-indigo-400'
    },
    
    // Группа: Прочее
    {
        type: 'posts',
        group: 'other',
        title: 'История постов',
        count: 1000,
        vkCount: 5400,
        lastUpdated: '13 фев, 09:20',
        icon: <NewspaperIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-indigo-800'
    },
    {
        type: 'authors',
        group: 'other',
        title: 'Авторы постов',
        count: 68,
        lastUpdated: '13 фев, 09:20',
        icon: <PencilIcon className="w-6 h-6 text-white" />,
        bgColor: 'bg-violet-600'
    }
];

// =====================================================================
// MOCK КОМПОНЕНТ: КАРТОЧКА СПИСКА
// =====================================================================

interface MockListCardPropsWithData {
    data: ListCardData;
    type?: never;
    isActive?: boolean;
    isRefreshing?: boolean;
    refreshStatus?: string | null;
    onClick?: () => void;
}

interface MockListCardPropsWithType {
    type: ListType;
    data?: never;
    isActive?: boolean;
    isRefreshing?: boolean;
    refreshStatus?: string | null;
    onClick?: () => void;
}

type MockListCardProps = MockListCardPropsWithData | MockListCardPropsWithType;

export const MockListCard: React.FC<MockListCardProps> = (props) => {
    const { isActive = false, isRefreshing = false, refreshStatus = null, onClick } = props;
    
    // Определяем данные: либо из props.data, либо по props.type
    const data = 'data' in props && props.data 
        ? props.data 
        : getListCardData().find(item => item.type === props.type)!;
    
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all h-[200px] flex flex-col
                ${isActive ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg' : 'border-gray-200'}
                ${isHovered && !isActive ? 'shadow-md' : 'shadow-sm'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Верхняя часть: иконка + счётчик */}
            <div className="flex items-start justify-between mb-2">
                {/* Цветная иконка */}
                <div className={`${data.bgColor} rounded-lg p-3 flex-shrink-0`}>
                    {data.icon}
                </div>

                {/* Счётчик */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800 leading-none">
                        {data.count.toLocaleString()}
                    </div>
                    {data.vkCount && (
                        <div className="text-[10px] text-gray-400 mt-1">
                            из {data.vkCount.toLocaleString()} в VK
                        </div>
                    )}
                </div>
            </div>

            {/* Название списка */}
            <div className="flex-1 flex items-start">
                <div className="text-sm font-medium text-gray-700 line-clamp-3 leading-snug" title={data.title}>
                    {data.title}
                </div>
            </div>

            {/* Нижняя часть: дата обновления + кнопка */}
            <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
                {/* Дата обновления */}
                {data.lastUpdated && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{data.lastUpdated}</span>
                    </div>
                )}

                {/* Кнопка обновления */}
                <button 
                    className={`p-1.5 rounded transition-colors ${
                        isRefreshing 
                            ? 'text-indigo-600 cursor-wait' 
                            : 'text-gray-400 hover:text-indigo-600'
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        // Имитация обновления
                    }}
                >
                    {isRefreshing ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Статус обновления (если есть) */}
            {refreshStatus && (
                <div className="mt-2 text-[10px] text-indigo-600 animate-pulse">
                    {refreshStatus}
                </div>
            )}
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: СЕТКА КАРТОЧЕК С ГРУППИРОВКОЙ
// =====================================================================

interface MockListsNavigationProps {
    activeGroup?: ListGroup;
    selectedList?: ListType | null;
    onGroupChange?: (group: ListGroup) => void;
    onListSelect?: (list: ListType) => void;
}

export const MockListsNavigation: React.FC<MockListsNavigationProps> = ({
    activeGroup = 'subscribers',
    selectedList = null,
    onGroupChange,
    onListSelect
}) => {
    const allLists = getListCardData();
    const filteredLists = allLists.filter(list => list.group === activeGroup);

    // Названия групп
    const groupTitles: Record<ListGroup, string> = {
        subscribers: 'Подписчики',
        activities: 'Активности',
        automations: 'Автоматизации',
        other: 'Прочее'
    };

    return (
        <div className="space-y-4">
            {/* Табы групп */}
            <div className="flex gap-4 border-b border-gray-200">
                {(Object.keys(groupTitles) as ListGroup[]).map(group => (
                    <button
                        key={group}
                        onClick={() => onGroupChange?.(group)}
                        className={`py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                            activeGroup === group
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {groupTitles[group]}
                    </button>
                ))}
            </div>

            {/* Сетка карточек */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLists.map(list => (
                    <MockListCard
                        key={list.type}
                        data={list}
                        isActive={selectedList === list.type}
                        onClick={() => onListSelect?.(list.type)}
                    />
                ))}
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: СТРОКА ТАБЛИЦЫ ПОЛЬЗОВАТЕЛЯ
// =====================================================================

interface MockMemberRowProps {
    user: {
        photo_url?: string;
        first_name: string;
        last_name: string;
        vk_user_id: number;
        domain?: string;
        has_mobile?: boolean;
        sex?: number;
        bdate?: string;
        city?: string;
        last_seen?: number;
        platform?: number;
        deactivated?: string;
        is_closed?: boolean;
        added_at: string;
        source?: string;
    };
}

export const MockMemberRow: React.FC<MockMemberRowProps> = ({ user }) => {
    // Статус
    const getStatusBadge = () => {
        if (user.deactivated === 'banned') {
            return <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">Заблокир.</span>;
        }
        if (user.deactivated === 'deleted') {
            return <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">Удален</span>;
        }
        if (user.is_closed) {
            return <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">Закрытый</span>;
        }
        return <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">Активен</span>;
    };

    // Платформа
    const getPlatformBadge = () => {
        if (!user.platform) return null;
        
        const platforms: Record<number, { label: string; classes: string }> = {
            1: { label: 'm.vk', classes: 'bg-orange-50 text-orange-700 border-orange-100' },
            2: { label: 'iOS', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
            3: { label: 'iOS', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
            4: { label: 'Android', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            6: { label: 'Web', classes: 'bg-blue-50 text-blue-700 border-blue-100' },
            7: { label: 'Web', classes: 'bg-blue-50 text-blue-700 border-blue-100' }
        };

        const platform = platforms[user.platform] || { label: 'Mob', classes: 'bg-gray-50 text-gray-600 border-gray-200' };
        
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${platform.classes}`}>
                {platform.label}
            </span>
        );
    };

    // Источник
    const getSourceBadge = () => {
        if (!user.source) return null;
        
        const sources: Record<string, { label: string; classes: string }> = {
            manual: { label: 'Ручной', classes: 'bg-gray-50 text-gray-600 border-gray-200' },
            callback: { label: 'Callback', classes: 'bg-blue-50 text-blue-700 border-blue-100' },
            conversation: { label: 'Диалог', classes: 'bg-cyan-50 text-cyan-700 border-cyan-100' },
            posts_sync: { label: 'Посты', classes: 'bg-violet-50 text-violet-700 border-violet-100' }
        };

        const source = sources[user.source];
        if (!source) return null;
        
        return (
            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${source.classes}`}>
                {source.label}
            </span>
        );
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit', 
            year: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Аватар */}
            <td className="px-4 py-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.photo_url ? (
                        <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </td>

            {/* Пользователь */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <a href={`https://vk.com/${user.domain || `id${user.vk_user_id}`}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-indigo-600 hover:text-indigo-800 font-medium">
                        {user.first_name} {user.last_name}
                    </a>
                    {user.has_mobile && (
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <title>Известен номер телефона</title>
                            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div className="text-xs text-gray-500">ID: {user.vk_user_id}</div>
            </td>

            {/* Пол */}
            <td className="px-4 py-3 text-sm text-gray-700">
                {user.sex === 1 ? 'Жен.' : user.sex === 2 ? 'Муж.' : '—'}
            </td>

            {/* ДР */}
            <td className="px-4 py-3 text-sm text-gray-700">
                {user.bdate || '—'}
            </td>

            {/* Город */}
            <td className="px-4 py-3 text-sm text-gray-700">
                {user.city || '—'}
            </td>

            {/* Онлайн / Платформа */}
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                    {user.last_seen && (
                        <div className="text-xs text-gray-600">{formatDate(user.last_seen)}</div>
                    )}
                    {getPlatformBadge()}
                </div>
            </td>

            {/* Статус */}
            <td className="px-4 py-3">
                {getStatusBadge()}
            </td>

            {/* Дата события */}
            <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(user.added_at).toLocaleString('ru-RU', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}
            </td>

            {/* Источник */}
            <td className="px-4 py-3">
                {getSourceBadge()}
            </td>
        </tr>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ
// =====================================================================

export const MockMembersTable: React.FC = () => {
    const mockUsers = [
        {
            photo_url: 'https://picsum.photos/seed/user1/100/100',
            first_name: 'Анна',
            last_name: 'Смирнова',
            vk_user_id: 123456789,
            domain: 'annasmirn',
            has_mobile: true,
            sex: 1,
            bdate: '15.3.1995',
            city: 'Москва',
            last_seen: Math.floor(Date.now() / 1000) - 3600,
            platform: 4,
            added_at: new Date().toISOString(),
            source: 'callback'
        },
        {
            photo_url: undefined,
            first_name: 'Дмитрий',
            last_name: 'Петров',
            vk_user_id: 987654321,
            domain: 'dmitrypetrov',
            has_mobile: false,
            sex: 2,
            bdate: '22.8.1988',
            city: 'Санкт-Петербург',
            last_seen: Math.floor(Date.now() / 1000) - 86400,
            platform: 2,
            is_closed: true,
            added_at: new Date(Date.now() - 86400000).toISOString(),
            source: 'conversation'
        },
        {
            photo_url: 'https://picsum.photos/seed/user3/100/100',
            first_name: 'Елена',
            last_name: 'Кузнецова',
            vk_user_id: 555666777,
            has_mobile: true,
            sex: 1,
            city: 'Екатеринбург',
            last_seen: Math.floor(Date.now() / 1000) - 300,
            platform: 1,
            added_at: new Date(Date.now() - 172800000).toISOString(),
            source: 'posts_sync'
        }
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Аватар
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Пользователь
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Пол
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ДР
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Город
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Онлайн / Платформа
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Статус
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Дата события
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Источник
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockUsers.map((user) => (
                            <MockMemberRow key={user.vk_user_id} user={user} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: СТРОКА ТАБЛИЦЫ ПОСТА
// =====================================================================

interface MockPostRowProps {
    post: {
        vk_id: number;
        image_url?: string;
        text: string;
        likes_count: number;
        comments_count: number;
        reposts_count: number;
        views_count: number;
        user_likes: number;
        date: number;
        last_updated: string;
        vk_link: string;
    };
}

export const MockPostRow: React.FC<MockPostRowProps> = ({ post }) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Превью */}
            <td className="px-4 py-3">
                <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    {post.image_url ? (
                        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>
            </td>

            {/* Текст */}
            <td className="px-4 py-3 max-w-xs">
                <p className="text-sm text-gray-700 line-clamp-2">
                    {post.text || <span className="italic text-gray-400">Текст отсутствует</span>}
                </p>
            </td>

            {/* Лайки */}
            <td className="px-4 py-3 text-center">
                <span className={`text-sm font-medium ${post.user_likes ? 'text-red-600' : 'text-gray-600'}`}>
                    {post.likes_count.toLocaleString()}
                </span>
            </td>

            {/* Комментарии */}
            <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-600">{post.comments_count.toLocaleString()}</span>
            </td>

            {/* Репосты */}
            <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-600">{post.reposts_count.toLocaleString()}</span>
            </td>

            {/* Просмотры */}
            <td className="px-4 py-3 text-center">
                <span className="text-sm text-gray-500">{post.views_count.toLocaleString()}</span>
            </td>

            {/* Дата публикации */}
            <td className="px-4 py-3 text-sm text-gray-700">
                {formatDate(post.date)}
            </td>

            {/* Дата сбора */}
            <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(post.last_updated).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </td>

            {/* Ссылка */}
            <td className="px-4 py-3 text-center">
                <a 
                    href={post.vk_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </td>
        </tr>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ТАБЛИЦА ПОСТОВ
// =====================================================================

export const MockPostsTable: React.FC = () => {
    const mockPosts = [
        {
            vk_id: 12345,
            image_url: 'https://picsum.photos/seed/post1/400/400',
            text: 'Друзья! Рады сообщить вам об открытии нового филиала нашей компании. Приглашаем всех на открытие!',
            likes_count: 245,
            comments_count: 18,
            reposts_count: 12,
            views_count: 3420,
            user_likes: 1,
            date: Math.floor(Date.now() / 1000) - 86400,
            last_updated: new Date().toISOString(),
            vk_link: 'https://vk.com/wall-123456_12345'
        },
        {
            vk_id: 12346,
            text: 'Скидки до 50% на все товары! Торопитесь, предложение ограничено!',
            likes_count: 89,
            comments_count: 5,
            reposts_count: 3,
            views_count: 1240,
            user_likes: 0,
            date: Math.floor(Date.now() / 1000) - 172800,
            last_updated: new Date().toISOString(),
            vk_link: 'https://vk.com/wall-123456_12346'
        },
        {
            vk_id: 12347,
            image_url: 'https://picsum.photos/seed/post3/400/400',
            text: '',
            likes_count: 156,
            comments_count: 12,
            reposts_count: 8,
            views_count: 2180,
            user_likes: 0,
            date: Math.floor(Date.now() / 1000) - 259200,
            last_updated: new Date().toISOString(),
            vk_link: 'https://vk.com/wall-123456_12347'
        }
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Медиа</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Текст</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                <span className="flex items-center justify-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Публ.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Собрано</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ссылка</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockPosts.map((post) => (
                            <MockPostRow key={post.vk_id} post={post} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: СТРОКА ТАБЛИЦЫ ВЗАИМОДЕЙСТВИЙ (с раскрытием)
// =====================================================================

interface MockInteractionRowProps {
    interaction: {
        id: string;
        vk_user_id: number;
        photo_url?: string;
        first_name: string;
        last_name: string;
        domain?: string;
        has_mobile?: number;
        sex?: number;
        bdate?: string;
        city?: string;
        last_seen?: number;
        platform?: number;
        deactivated?: string;
        is_closed?: boolean;
        interaction_count: number;
        last_interaction_date: string;
        post_ids?: number[];
    };
}

export const MockInteractionRow: React.FC<MockInteractionRowProps> = ({ interaction }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusBadge = () => {
        if (interaction.deactivated === 'banned') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Заблокир.</span>;
        }
        if (interaction.deactivated === 'deleted') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Удален</span>;
        }
        if (interaction.is_closed) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Закрытый</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Активен</span>;
    };

    const getPlatformBadge = () => {
        if (!interaction.platform) return null;
        
        const platforms: Record<number, { label: string; classes: string }> = {
            1: { label: 'm.vk', classes: 'bg-orange-50 text-orange-700 border-orange-100' },
            2: { label: 'iOS', classes: 'bg-slate-100 text-slate-700 border-slate-200' },
            4: { label: 'Android', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
            7: { label: 'Web', classes: 'bg-blue-50 text-blue-700 border-blue-100' }
        };

        const platform = platforms[interaction.platform] || { label: 'Mob', classes: 'bg-gray-50 text-gray-600 border-gray-200' };
        
        return (
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ml-2 ${platform.classes}`}>
                {platform.label}
            </span>
        );
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <tr className={`transition-colors cursor-pointer ${
                isExpanded ? 'bg-indigo-50' : 'hover:bg-gray-50'
            }`}>
                {/* Стрелка раскрытия */}
                <td className="px-4 py-3">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`p-1 rounded hover:bg-gray-200 transition-all ${
                            isExpanded ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                    >
                        <svg 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </td>

                {/* Аватар */}
                <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        {interaction.photo_url ? (
                            <img src={interaction.photo_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </td>

                {/* Пользователь */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <a 
                            href={`https://vk.com/${interaction.domain || `id${interaction.vk_user_id}`}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            {interaction.first_name} {interaction.last_name}
                        </a>
                        {interaction.has_mobile && (
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <title>Известен номер телефона</title>
                                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">ID: {interaction.vk_user_id}</div>
                </td>

                {/* Пол */}
                <td className="px-4 py-3 text-sm text-gray-700">
                    {interaction.sex === 1 ? 'Жен.' : interaction.sex === 2 ? 'Муж.' : '—'}
                </td>

                {/* ДР */}
                <td className="px-4 py-3 text-sm text-gray-700">
                    {interaction.bdate || '—'}
                </td>

                {/* Город */}
                <td className="px-4 py-3 text-sm text-gray-700">
                    {interaction.city || '—'}
                </td>

                {/* Онлайн / Платформа */}
                <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                        {interaction.last_seen && (
                            <div className="text-xs text-gray-600">{formatDate(interaction.last_seen)}</div>
                        )}
                        {getPlatformBadge()}
                    </div>
                </td>

                {/* Статус */}
                <td className="px-4 py-3">
                    {getStatusBadge()}
                </td>

                {/* Всего (счётчик) */}
                <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-white border border-gray-300 text-gray-700 shadow-sm">
                        {interaction.interaction_count}
                    </span>
                </td>

                {/* Последняя активность */}
                <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(interaction.last_interaction_date).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </td>
            </tr>

            {/* Раскрытая строка с постами */}
            {isExpanded && (
                <tr className="bg-gray-50/50">
                    <td colSpan={10} className="px-4 py-4">
                        <div className="ml-12">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                История активности ({interaction.post_ids?.length || 0})
                            </h4>
                            {interaction.post_ids && interaction.post_ids.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {interaction.post_ids.map(postId => (
                                        <a
                                            key={postId}
                                            href={`https://vk.com/wall-123456_${postId}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2 py-1 text-xs rounded border border-gray-300 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                        >
                                            Post #{postId}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Нет данных о постах</p>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ТАБЛИЦА ВЗАИМОДЕЙСТВИЙ
// =====================================================================

export const MockInteractionsTable: React.FC = () => {
    const mockInteractions = [
        {
            id: '1',
            vk_user_id: 111222333,
            photo_url: 'https://picsum.photos/seed/inter1/100/100',
            first_name: 'Ольга',
            last_name: 'Иванова',
            domain: 'olgaivanova',
            has_mobile: 1,
            sex: 1,
            bdate: '10.5.1992',
            city: 'Москва',
            last_seen: Math.floor(Date.now() / 1000) - 7200,
            platform: 4,
            interaction_count: 15,
            last_interaction_date: new Date().toISOString(),
            post_ids: [12345, 12346, 12347, 12350, 12355]
        },
        {
            id: '2',
            vk_user_id: 444555666,
            first_name: 'Сергей',
            last_name: 'Волков',
            sex: 2,
            city: 'Казань',
            last_seen: Math.floor(Date.now() / 1000) - 172800,
            platform: 2,
            interaction_count: 8,
            last_interaction_date: new Date(Date.now() - 86400000).toISOString(),
            post_ids: [12345, 12348]
        },
        {
            id: '3',
            vk_user_id: 777888999,
            photo_url: 'https://picsum.photos/seed/inter3/100/100',
            first_name: 'Мария',
            last_name: 'Соколова',
            domain: 'mariasokolova',
            sex: 1,
            bdate: '18.11.1998',
            city: 'Новосибирск',
            last_seen: Math.floor(Date.now() / 1000) - 3600,
            platform: 1,
            interaction_count: 23,
            last_interaction_date: new Date(Date.now() - 3600000).toISOString(),
            post_ids: [12345, 12346, 12347, 12348, 12349, 12350, 12351]
        }
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 w-12"></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Аватар</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пол</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ДР</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Город</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Онлайн / Платформа</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Всего</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Посл. актив</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockInteractions.map((interaction) => (
                            <MockInteractionRow key={interaction.id} interaction={interaction} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: КАРТОЧКА ТИПА СПИСКА С ПОЛНЫМ ОПИСАНИЕМ
// =====================================================================

interface ListTypeCardProps {
    type: string;
    title: string;
    description: string;
    group: string;
    color: string;
    icon: React.ReactNode;
    source: string;
    apiMethod?: string;
}

export const ListTypeCard: React.FC<ListTypeCardProps> = ({ 
    type, 
    title, 
    description, 
    group, 
    color, 
    icon, 
    source, 
    apiMethod 
}) => {
    const groupColors: Record<string, string> = {
        'Подписчики': 'border-indigo-200 bg-indigo-50/30',
        'Активности': 'border-pink-200 bg-pink-50/30',
        'Автоматизации': 'border-amber-200 bg-amber-50/30',
        'Прочее': 'border-violet-200 bg-violet-50/30'
    };

    return (
        <div className={`border-2 rounded-lg p-4 ${groupColors[group] || 'border-gray-200 bg-gray-50'}`}>
            {/* Заголовок с иконкой */}
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 ${color} text-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 mb-1">{title}</h4>
                    <p className="text-xs text-gray-500 font-mono">{type}</p>
                </div>
            </div>

            {/* Описание */}
            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{description}</p>

            {/* Метаинформация */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-600">Группа:</span>
                    <span className="px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-700">{group}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-gray-600">Источник:</span>
                    <span className="text-gray-700">{source}</span>
                </div>
                {apiMethod && (
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-600">VK API:</span>
                        <code className="px-2 py-0.5 bg-gray-900 text-green-400 rounded font-mono">{apiMethod}</code>
                    </div>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: СЕТКА ВСЕХ ТИПОВ СПИСКОВ
// =====================================================================

export const AllListTypesGrid: React.FC = () => {
    const listTypes = [
        // ГРУППА: ПОДПИСЧИКИ
        {
            type: 'subscribers_of_group',
            title: 'Подписчики',
            description: 'Текущие подписчики сообщества. Загружаются через groups.getMembers батчами по 1000.',
            group: 'Подписчики',
            color: 'bg-indigo-500',
            icon: <UsersIcon />,
            source: 'VK API → groups.getMembers',
            apiMethod: 'groups.getMembers'
        },
        {
            type: 'mailing',
            title: 'В рассылке',
            description: 'Пользователи с активным диалогом. Статус can_write определяет возможность отправки сообщений.',
            group: 'Подписчики',
            color: 'bg-cyan-600',
            icon: <MessageIcon />,
            source: 'VK API → messages.getConversations',
            apiMethod: 'messages.getConversations'
        },
        {
            type: 'history_join',
            title: 'Вступившие (История)',
            description: 'Все кто когда-либо вступал. Автоматически пополняется при сравнении списков подписчиков.',
            group: 'Подписчики',
            color: 'bg-teal-500',
            icon: <UserPlusIcon />,
            source: 'Автоматически при синхронизации подписчиков'
        },
        {
            type: 'history_leave',
            title: 'Вышедшие (История)',
            description: 'Все кто покинул сообщество. Детектируется как разница между старым и новым списком.',
            group: 'Подписчики',
            color: 'bg-orange-500',
            icon: <UserMinusIcon />,
            source: 'Автоматически при синхронизации подписчиков'
        },
        // ГРУППА: АКТИВНОСТИ
        {
            type: 'post_likers',
            title: 'Лайкали',
            description: 'Пользователи лайкнувшие посты. Быстрое сканирование первых 1000, глубокое — если больше.',
            group: 'Активности',
            color: 'bg-pink-500',
            icon: <HeartIcon />,
            source: 'VK API → likes.getList (через execute)',
            apiMethod: 'likes.getList'
        },
        {
            type: 'post_commenters',
            title: 'Комментировали',
            description: 'Авторы комментариев под постами. Собирается с extended=1 для получения профилей.',
            group: 'Активности',
            color: 'bg-blue-500',
            icon: <MessageIcon />,
            source: 'VK API → wall.getComments',
            apiMethod: 'wall.getComments'
        },
        {
            type: 'post_reposters',
            title: 'Репостили',
            description: 'Пользователи сделавшие репост. Требует токен администратора (level 3) для доступа к API.',
            group: 'Активности',
            color: 'bg-purple-500',
            icon: <ShareIcon />,
            source: 'VK API → wall.getReposts (только админ)',
            apiMethod: 'wall.getReposts'
        },
        // ГРУППА: АВТОМАТИЗАЦИИ
        {
            type: 'contest_winners',
            title: 'Конкурс отзывов: Победители',
            description: 'Победители конкурса со статусом "winner" в таблице general_contest_entries.',
            group: 'Автоматизации',
            color: 'bg-amber-500',
            icon: <TrophyIcon />,
            source: 'Внутренняя БД → general_contest_entries (status=winner)'
        },
        {
            type: 'contest_participants',
            title: 'Конкурс отзывов: Участники',
            description: 'Все участники конкурса (статус "participant" или "winner").',
            group: 'Автоматизации',
            color: 'bg-green-500',
            icon: <UsersIcon />,
            source: 'Внутренняя БД → general_contest_entries'
        },
        {
            type: 'contest_posts',
            title: 'Конкурс отзывов: Посты',
            description: 'Посты с отзывами участников. Показывается только счётчик постов из contest_entries.',
            group: 'Автоматизации',
            color: 'bg-indigo-400',
            icon: <MessageIcon />,
            source: 'Внутренняя БД → general_contest_entries (подсчёт)'
        },
        // ГРУППА: ПРОЧЕЕ
        {
            type: 'posts_history',
            title: 'История постов',
            description: 'Архив постов со стены с метриками. Двойной счётчик: в БД vs всего в VK. Режимы: 1000 (быстро) или all (долго).',
            group: 'Прочее',
            color: 'bg-indigo-800',
            icon: <DocumentIcon />,
            source: 'VK API → wall.get',
            apiMethod: 'wall.get'
        },
        {
            type: 'post_authors',
            title: 'Авторы постов',
            description: 'Уникальные пользователи из signer_id и post_author_id. Извлекается автоматически при синхронизации постов.',
            group: 'Прочее',
            color: 'bg-violet-600',
            icon: <PenIcon />,
            source: 'Автоматически из wall.get + users.get'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listTypes.map((listType) => (
                <ListTypeCard key={listType.type} {...listType} />
            ))}
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ТАБЛИЦА СРАВНЕНИЯ ТИПОВ
// =====================================================================

export const ListTypesComparisonTable: React.FC = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Тип списка</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Когда использовать</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Обновление</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Особенности</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Подписчики</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Рассылки, анализ аудитории, сегментация</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Раз в день</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Базовый список, всегда актуален</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">В рассылке</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Таргетированные сообщения, активные диалоги</td>
                            <td className="px-4 py-3 text-sm text-gray-600">По запросу</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Показывает can_write статус</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Вступившие / Вышедшие</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Отслеживание динамики, анализ оттока</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Автоматически</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Только для истории, не редактируется</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Лайкали</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Поиск активной аудитории, ретаргетинг</td>
                            <td className="px-4 py-3 text-sm text-gray-600">2–4 часа</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Быстрое сканирование 1000 лайков</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Комментировали</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Вовлечённая аудитория, обратная связь</td>
                            <td className="px-4 py-3 text-sm text-gray-600">2–4 часа</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Батчи по 100 комментариев</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Репостили</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Амбассадоры бренда, виральность</td>
                            <td className="px-4 py-3 text-sm text-gray-600">По запросу</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Требует токен администратора</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Конкурс: Победители</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Награждение, персональные сообщения</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Не требуется</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Управляется вручную в конкурсе</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Конкурс: Участники</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Общая рассылка участникам</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Не требуется</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Включает победителей</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">История постов</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Аналитика контента, поиск трендов</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Раз в несколько дней</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Режимы: 1000 (быстро) или all (долго)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-900">Авторы постов</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Поиск авторов контента, координация</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Автоматически</td>
                            <td className="px-4 py-3 text-sm text-gray-500">Извлекается из signer_id при синхронизации</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: АНАТОМИЯ КАРТОЧКИ СПИСКА
// =====================================================================

export const ListCardAnatomy: React.FC = () => {
    return (
        <div className="relative bg-white p-4 rounded-xl border-2 border-indigo-500 shadow-md w-40 h-[160px] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                {/* Иконка */}
                <div className="relative">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                        <UsersIcon />
                    </div>
                    <div className="absolute -top-2 -left-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded">
                        Header
                    </div>
                </div>
                
                {/* Кнопка обновления */}
                <div className="relative">
                    <button className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                    </button>
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-bold px-1 rounded whitespace-nowrap">
                        Кнопка
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col relative">
                <div className="absolute -left-6 top-8 bg-green-600 text-white text-[8px] font-bold px-1 rounded">
                    Body
                </div>
                
                {/* Счётчик */}
                <div className="text-2xl font-bold text-gray-900 mb-1">1,234</div>
                
                {/* Название */}
                <div className="text-sm font-medium text-gray-700 leading-tight line-clamp-2 mb-2">
                    Подписчики
                </div>
                
                {/* Блок статуса */}
                <div className="h-5 mt-auto"></div>
            </div>

            {/* Footer */}
            <div className="relative pt-3 border-t border-gray-100">
                <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white text-[8px] font-bold px-1 rounded">
                    Footer
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">23 дек, 14:30</span>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: КАРТОЧКА В РАЗНЫХ СОСТОЯНИЯХ
// =====================================================================

interface CardStatesDemoProps {
    showState: 'normal' | 'hover' | 'active' | 'loading' | 'empty';
}

export const CardStatesDemo: React.FC<CardStatesDemoProps> = ({ showState }) => {
    const getCardClasses = () => {
        const base = "relative bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 w-40 h-[160px] flex flex-col";
        
        switch (showState) {
            case 'hover':
                return `${base} border-gray-300 shadow-md`;
            case 'active':
                return `${base} border-transparent ring-2 ring-indigo-500 shadow-md`;
            case 'loading':
                return `${base} border-gray-200`;
            case 'empty':
                return `${base} border-gray-200`;
            default:
                return `${base} border-gray-200`;
        }
    };

    return (
        <div className={getCardClasses()}>
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center">
                    <UsersIcon />
                </div>
                
                {showState === 'loading' ? (
                    <div className="p-1.5">
                        <div className="h-4 w-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <button className={`p-1.5 rounded-full transition-colors ${
                        showState === 'hover' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'
                    }`}>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                    {showState === 'empty' ? '0' : '1,234'}
                </div>
                <div className="text-sm font-medium text-gray-700 leading-tight line-clamp-2 mb-2">
                    Подписчики
                </div>
                
                {/* Блок статуса загрузки */}
                <div className="h-5 mt-auto">
                    {showState === 'loading' && (
                        <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium animate-pulse">
                            <div className="h-3 w-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <span className="truncate">Загрузка...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">
                        {showState === 'empty' ? 'Нет данных' : '23 дек, 14:30'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ДЕМОНСТРАЦИЯ ВСЕХ СОСТОЯНИЙ В РЯДУ
// =====================================================================

export const AllCardStates: React.FC = () => {
    return (
        <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center gap-2">
                <CardStatesDemo showState="normal" />
                <span className="text-sm font-medium text-gray-700">Обычное</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <CardStatesDemo showState="hover" />
                <span className="text-sm font-medium text-gray-700">При наведении</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <CardStatesDemo showState="active" />
                <span className="text-sm font-medium text-gray-700">Активная</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <CardStatesDemo showState="loading" />
                <span className="text-sm font-medium text-gray-700">Обновляется</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <CardStatesDemo showState="empty" />
                <span className="text-sm font-medium text-gray-700">Пустая</span>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: КАРТОЧКА С DROPDOWN МЕНЮ
// =====================================================================

export const CardWithDropdown: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setMenuOpen(false);
        setTimeout(() => setSelectedOption(null), 2000);
    };

    return (
        <div className="relative">
            <div className="relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-40 h-[160px] flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-indigo-800 text-white rounded-lg flex items-center justify-center">
                        <DocumentIcon />
                    </div>
                    
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col">
                    <div className="mb-1">
                        <div className="text-2xl font-bold text-gray-900">856</div>
                        <p className="text-[10px] text-gray-500">из 3,240 в VK</p>
                    </div>
                    <div className="text-sm font-medium text-gray-700 leading-tight line-clamp-2 mb-2">
                        Посты (История)
                    </div>
                    
                    {selectedOption && (
                        <div className="h-5 flex items-center gap-2 text-xs text-green-600 font-medium animate-pulse">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="truncate">{selectedOption}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">24 дек, 09:15</span>
                    </div>
                </div>
            </div>

            {/* Dropdown меню */}
            {menuOpen && (
                <div className="absolute top-12 right-0 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50 w-48 animate-fade-in">
                    <button
                        onClick={() => handleOptionClick('Обновлено 1000')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                        Обновить 1000 (быстро)
                    </button>
                    <button
                        onClick={() => handleOptionClick('Обновлено всё')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                        Обновить всё (долго)
                    </button>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// MOCK КОМПОНЕНТ: ИНТЕРАКТИВНАЯ КАРТОЧКА С ПЕРЕКЛЮЧЕНИЕМ СОСТОЯНИЙ
// =====================================================================

export const InteractiveCardDemo: React.FC = () => {
    const [currentState, setCurrentState] = useState<'normal' | 'hover' | 'active' | 'loading' | 'empty'>('normal');

    return (
        <div className="flex gap-6">
            {/* Карточка */}
            <div>
                <CardStatesDemo showState={currentState} />
            </div>

            {/* Панель управления */}
            <div className="flex flex-col gap-2">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Переключить состояние:</h4>
                <button
                    onClick={() => setCurrentState('normal')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        currentState === 'normal'
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Обычное
                </button>
                <button
                    onClick={() => setCurrentState('hover')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        currentState === 'hover'
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    При наведении
                </button>
                <button
                    onClick={() => setCurrentState('active')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        currentState === 'active'
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Активная
                </button>
                <button
                    onClick={() => setCurrentState('loading')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        currentState === 'loading'
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Обновляется
                </button>
                <button
                    onClick={() => setCurrentState('empty')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                        currentState === 'empty'
                            ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-medium'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Пустая
                </button>
            </div>
        </div>
    );
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ ДЛЯ РАЗДЕЛА "3.2.3. ПРОСМОТР УЧАСТНИКОВ"
// =====================================================================

// Типы данных участника (из реального кода SystemListSubscriber)
interface MockMember {
    id: string;
    vk_user_id: number;
    first_name: string;
    last_name: string;
    domain?: string;
    photo_url?: string;
    sex?: number;              // 1 - женский, 2 - мужской
    bdate?: string;            // Формат: "15.3.1995"
    city?: string;
    country?: string;
    has_mobile?: boolean;
    last_seen?: number;        // Unix timestamp
    platform?: number;         // 1-m.vk, 2-iOS, 3-iPad, 4-Android, 6-Win, 7-Web
    added_at: string;          // ISO дата
    deactivated?: string;      // "banned" | "deleted"
    is_closed?: boolean;
    source: string;            // "manual" | "callback" | "conversation" | "posts_sync"
}

// Реальные моковые данные участников
const mockMembers: MockMember[] = [
    {
        id: '1',
        photo_url: 'https://picsum.photos/seed/user1/100/100',
        first_name: 'Анна',
        last_name: 'Смирнова',
        vk_user_id: 123456789,
        domain: 'annasmirn',
        has_mobile: true,
        sex: 1,
        bdate: '15.3.1995',
        city: 'Москва',
        last_seen: Math.floor(Date.now() / 1000) - 3600,
        platform: 4,
        added_at: new Date().toISOString(),
        source: 'callback'
    },
    {
        id: '2',
        photo_url: undefined,
        first_name: 'Дмитрий',
        last_name: 'Петров',
        vk_user_id: 987654321,
        domain: 'dmitrypetrov',
        has_mobile: false,
        sex: 2,
        bdate: '22.8.1988',
        city: 'Санкт-Петербург',
        last_seen: Math.floor(Date.now() / 1000) - 86400,
        platform: 2,
        is_closed: true,
        added_at: new Date(Date.now() - 86400000).toISOString(),
        source: 'conversation'
    },
    {
        id: '3',
        photo_url: 'https://picsum.photos/seed/user3/100/100',
        first_name: 'Елена',
        last_name: 'Кузнецова',
        vk_user_id: 555666777,
        has_mobile: true,
        sex: 1,
        city: 'Екатеринбург',
        last_seen: Math.floor(Date.now() / 1000) - 300,
        platform: 1,
        added_at: new Date(Date.now() - 172800000).toISOString(),
        source: 'posts_sync'
    },
    {
        id: '4',
        photo_url: 'https://picsum.photos/seed/user4/100/100',
        first_name: 'Игорь',
        last_name: 'Соколов',
        vk_user_id: 111222333,
        has_mobile: false,
        sex: 2,
        bdate: '10.12.2000',
        city: 'Новосибирск',
        last_seen: Math.floor(Date.now() / 1000) - 604800,
        platform: 7,
        added_at: new Date(Date.now() - 259200000).toISOString(),
        source: 'manual',
        deactivated: 'banned'
    },
    {
        id: '5',
        photo_url: undefined,
        first_name: 'Мария',
        last_name: 'Иванова',
        vk_user_id: 444555666,
        has_mobile: true,
        sex: 1,
        bdate: '5.7.1992',
        city: 'Казань',
        platform: 4,
        added_at: new Date(Date.now() - 345600000).toISOString(),
        source: 'callback',
        deactivated: 'deleted'
    }
];

// Компонент: Аннотированная таблица участников
export const MembersTableAnatomy: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Зона 1: Панель фильтров */}
            <div className="relative">
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-grow">
                            <input 
                                type="text" 
                                placeholder="ФИО, ID, ссылка..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md"
                                disabled
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700">
                            Статус ▼
                        </button>
                        <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700">
                            Пол ▼
                        </button>
                        <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700">
                            Онлайн ▼
                        </button>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    1. Панель фильтров
                </div>
            </div>

            {/* Зона 2: Заголовки таблицы */}
            <div className="relative">
                <div className="bg-gray-50 border-2 border-green-400 rounded-lg p-3">
                    <div className="grid grid-cols-9 gap-2 text-xs font-medium text-gray-500 uppercase">
                        <div>Аватар</div>
                        <div>Пользователь</div>
                        <div>Пол</div>
                        <div>ДР</div>
                        <div>Город</div>
                        <div>Онлайн</div>
                        <div>Статус</div>
                        <div>Дата</div>
                        <div>Источник</div>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    2. Заголовки колонок
                </div>
            </div>

            {/* Зона 3: Строки данных */}
            <div className="relative">
                <div className="bg-white border-2 border-purple-400 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>Анна Смирнова</div>
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs">Ж</span>
                        <span className="text-xs text-gray-500">15.3.1995</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>Дмитрий Петров</div>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">М</span>
                        <span className="text-xs text-gray-500">22.8.1988</span>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                    3. Строки участников
                </div>
            </div>

            {/* Зона 4: Индикатор загрузки */}
            <div className="relative">
                <div className="bg-indigo-50 border-2 border-indigo-400 rounded-lg p-4 text-center">
                    <div className="inline-block h-6 w-6 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
                <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                    4. Загрузка следующей страницы
                </div>
            </div>
        </div>
    );
};

// Компонент: Строка участника с бейджами
export const MemberRow: React.FC<{ member: MockMember }> = ({ member }) => {
    const formatLastSeen = (lastSeen: number | undefined) => {
        if (!lastSeen) return '—';
        const date = new Date(lastSeen * 1000);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAddedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPlatformBadge = (platform: number | undefined) => {
        switch (platform) {
            case 1:
                return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-orange-50 text-orange-700 border-orange-100">m.vk</span>;
            case 2:
            case 3:
                return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-slate-100 text-slate-700 border-slate-200">iOS</span>;
            case 4:
                return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-emerald-50 text-emerald-700 border-emerald-100">Android</span>;
            case 7:
                return <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border bg-blue-50 text-blue-700 border-blue-100">Web</span>;
            default:
                return <span className="text-xs text-gray-400">—</span>;
        }
    };

    const getStatusBadge = () => {
        if (member.deactivated === 'banned') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Заблокир.</span>;
        }
        if (member.deactivated === 'deleted') {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Удален</span>;
        }
        if (member.is_closed) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Закрытый</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Активен</span>;
    };

    const getSourceBadge = () => {
        switch (member.source) {
            case 'manual':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">Ручной</span>;
            case 'callback':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Callback</span>;
            case 'conversation':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">Диалог</span>;
            case 'posts_sync':
                return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">Посты</span>;
            default:
                return <span className="text-xs text-gray-400">—</span>;
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            {/* Аватар */}
            <td className="px-4 py-3">
                {member.photo_url ? (
                    <img src={member.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </td>

            {/* Пользователь (ID / ФИО) */}
            <td className="px-4 py-3">
                <div className="flex flex-col">
                    <a 
                        href={`https://vk.com/${member.domain || `id${member.vk_user_id}`}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                    >
                        {member.vk_user_id}
                    </a>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                        {member.first_name} {member.last_name}
                        {member.has_mobile && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor" title="Известен номер телефона">
                                <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </div>
            </td>

            {/* Пол */}
            <td className="px-4 py-3">
                {member.sex === 1 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-700">Ж</span>
                ) : member.sex === 2 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">М</span>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </td>

            {/* День рождения */}
            <td className="px-4 py-3">
                <span className="text-xs text-gray-700">{member.bdate || '—'}</span>
            </td>

            {/* Город */}
            <td className="px-4 py-3">
                <span className="text-xs text-gray-700">{member.city || '—'}</span>
            </td>

            {/* Онлайн / Платформа */}
            <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500">{formatLastSeen(member.last_seen)}</span>
                    {getPlatformBadge(member.platform)}
                </div>
            </td>

            {/* Статус */}
            <td className="px-4 py-3">
                {getStatusBadge()}
            </td>

            {/* Дата события */}
            <td className="px-4 py-3">
                <span className="text-xs text-gray-700">{formatAddedDate(member.added_at)}</span>
            </td>

            {/* Источник */}
            <td className="px-4 py-3">
                {getSourceBadge()}
            </td>
        </tr>
    );
};

// Компонент: Таблица участников с данными
export const MembersTableDemo: React.FC = () => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm relative">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">
                            
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Пользователь (ID / ФИО)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Пол
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            ДР
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Город
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Онлайн / Платформа
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Статус
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Дата события
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                            Источник
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {mockMembers.map(member => (
                        <MemberRow key={member.id} member={member} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Компонент: Состояния таблицы
export const TableStatesDemo: React.FC = () => {
    const [state, setState] = useState<'loading' | 'empty' | 'data'>('loading');

    return (
        <div className="space-y-4">
            {/* Панель переключения */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setState('loading')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'loading'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Загрузка
                </button>
                <button
                    onClick={() => setState('empty')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'empty'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Пустой список
                </button>
                <button
                    onClick={() => setState('data')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'data'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    С данными
                </button>
            </div>

            {/* Отображение состояния */}
            <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[200px] flex items-center justify-center">
                {state === 'loading' && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="inline-block h-8 w-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p>Загрузка участников...</p>
                    </div>
                )}

                {state === 'empty' && (
                    <div className="p-12 text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="font-medium">Список пуст</p>
                        <p className="text-sm mt-1">Участники появятся после синхронизации</p>
                    </div>
                )}

                {state === 'data' && (
                    <div className="w-full p-4">
                        <MembersTableDemo />
                    </div>
                )}
            </div>
        </div>
    );
};

// Компонент: Интерактивные фильтры
export const FiltersDemo: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sexFilter, setSexFilter] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showSexDropdown, setShowSexDropdown] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'Все' },
        { value: 'active', label: 'Активные' },
        { value: 'banned', label: 'Забанены' },
        { value: 'deleted', label: 'Удалены' }
    ];

    const sexOptions = [
        { value: 'all', label: 'Любой' },
        { value: '1', label: 'Женский' },
        { value: '2', label: 'Мужской' },
        { value: '0', label: 'Не указан' }
    ];

    const filteredMembers = mockMembers.filter(member => {
        // Фильтр по поиску
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            member.first_name.toLowerCase().includes(searchLower) ||
            member.last_name.toLowerCase().includes(searchLower) ||
            member.vk_user_id.toString().includes(searchQuery);

        // Фильтр по статусу
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && !member.deactivated && !member.is_closed) ||
            (statusFilter === 'banned' && member.deactivated === 'banned') ||
            (statusFilter === 'deleted' && member.deactivated === 'deleted');

        // Фильтр по полу
        const matchesSex = sexFilter === 'all' ||
            (sexFilter === '0' && !member.sex) ||
            (member.sex?.toString() === sexFilter);

        return matchesSearch && matchesStatus && matchesSex;
    });

    return (
        <div className="space-y-4">
            {/* Панель фильтров */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Поиск */}
                    <div className="relative flex-grow min-w-[200px]">
                        <input 
                            type="text" 
                            placeholder="ФИО, ID, ссылка..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Фильтр: Статус */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowStatusDropdown(!showStatusDropdown);
                                setShowSexDropdown(false);
                            }}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                            Статус: {statusOptions.find(o => o.value === statusFilter)?.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showStatusDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                {statusOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setStatusFilter(option.value);
                                            setShowStatusDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                            statusFilter === option.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Фильтр: Пол */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowSexDropdown(!showSexDropdown);
                                setShowStatusDropdown(false);
                            }}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                        >
                            Пол: {sexOptions.find(o => o.value === sexFilter)?.label}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showSexDropdown && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                {sexOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSexFilter(option.value);
                                            setShowSexDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                                            sexFilter === option.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Кнопка сброса */}
                    {(searchQuery || statusFilter !== 'all' || sexFilter !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setSexFilter('all');
                            }}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1 px-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Сбросить
                        </button>
                    )}
                </div>

                {/* Счётчик результатов */}
                <div className="mt-3 text-sm text-gray-600">
                    Найдено участников: <strong>{filteredMembers.length}</strong> из {mockMembers.length}
                </div>
            </div>

            {/* Таблица с отфильтрованными данными */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50"></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Пользователь</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Пол</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">ДР</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Город</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Онлайн</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Статус</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Дата</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Источник</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                                <MemberRow key={member.id} member={member} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                                    Участников с такими фильтрами не найдено
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Компонент: Демонстрация Infinite Scroll
export const InfiniteScrollDemo: React.FC = () => {
    const [items, setItems] = useState<MockMember[]>(mockMembers.slice(0, 3));
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const loadMore = () => {
        if (isLoading || items.length >= mockMembers.length) return;
        
        setIsLoading(true);
        
        // Имитация загрузки с сервера
        setTimeout(() => {
            const newItems = mockMembers.slice(items.length, items.length + 2);
            setItems([...items, ...newItems]);
            setPage(page + 1);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                    <strong>Как работает:</strong> Прокрутите таблицу вниз до конца. Когда индикатор загрузки появится на экране — 
                    автоматически загрузятся следующие 2 участника. Так работает "бесконечная прокрутка" — не нужно нажимать кнопки.
                </p>
            </div>

            <div className="bg-gray-100 p-2 rounded text-sm text-gray-700">
                Загружено: <strong>{items.length}</strong> из {mockMembers.length} участников | Страница: <strong>{page}</strong>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[350px] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50"></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Пользователь</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Город</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Статус</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {items.map(member => (
                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    {member.photo_url ? (
                                        <img src={member.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm font-medium text-gray-900">{member.first_name} {member.last_name}</div>
                                    <div className="text-xs text-gray-500">{member.vk_user_id}</div>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-700">{member.city || '—'}</td>
                                <td className="px-4 py-3">
                                    {member.deactivated ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {member.deactivated === 'banned' ? 'Заблокир.' : 'Удален'}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Активен
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Индикатор загрузки / Триггер для IntersectionObserver */}
                {items.length < mockMembers.length && (
                    <div 
                        className="h-16 w-full flex justify-center items-center py-4 border-t border-gray-100"
                        onMouseEnter={loadMore}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="inline-block h-6 w-6 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                                <span className="text-sm">Загрузка...</span>
                            </div>
                        ) : (
                            <button
                                onClick={loadMore}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Загрузить ещё
                            </button>
                        )}
                    </div>
                )}

                {items.length >= mockMembers.length && (
                    <div className="py-4 text-center text-sm text-gray-400 border-t border-gray-100">
                        Все участники загружены
                    </div>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ ДЛЯ РАЗДЕЛА "3.2.4. ПРОСМОТР ПОСТОВ"
// =====================================================================

// Типы данных поста (из реального кода SystemListPost)
interface MockPost {
    id: string;
    vk_id: number;
    date: number;                    // Unix timestamp публикации
    text: string;
    image_url?: string;              // Превью изображения
    likes_count: number;
    comments_count: number;
    reposts_count: number;
    views_count: number;
    user_likes: number;              // 1 если текущий пользователь лайкнул
    last_updated: string;            // ISO дата последнего обновления данных
    vk_link: string;                 // Прямая ссылка на пост в VK
}

// Реальные моковые данные постов
const mockPosts: MockPost[] = [
    {
        id: '1',
        vk_id: 12345,
        image_url: 'https://picsum.photos/seed/post1/400/400',
        text: 'Друзья! Рады сообщить вам об открытии нового филиала нашей компании. Приглашаем всех на открытие!',
        likes_count: 245,
        comments_count: 18,
        reposts_count: 12,
        views_count: 3420,
        user_likes: 1,
        date: 1708828800,
        last_updated: '2024-02-15T14:23:00.000Z',
        vk_link: 'https://vk.com/wall-123456_12345'
    },
    {
        id: '2',
        vk_id: 12346,
        text: 'Скидки до 50% на все товары! Торопитесь, предложение ограничено!',
        likes_count: 89,
        comments_count: 5,
        reposts_count: 3,
        views_count: 1240,
        user_likes: 0,
        date: 1708742400,
        last_updated: '2024-02-14T10:15:00.000Z',
        vk_link: 'https://vk.com/wall-123456_12346'
    },
    {
        id: '3',
        vk_id: 12347,
        image_url: 'https://picsum.photos/seed/post3/400/400',
        text: 'Новая коллекция уже в продаже! Заходите на наш сайт и выбирайте то, что вам по душе.',
        likes_count: 156,
        comments_count: 12,
        reposts_count: 8,
        views_count: 2180,
        user_likes: 1,
        date: 1708656000,
        last_updated: '2024-02-13T18:45:00.000Z',
        vk_link: 'https://vk.com/wall-123456_12347'
    },
    {
        id: '4',
        vk_id: 12348,
        image_url: 'https://picsum.photos/seed/post4/400/400',
        text: 'Конкурс репостов! Выиграйте сертификат на 5000 рублей. Условия в комментариях.',
        likes_count: 512,
        comments_count: 143,
        reposts_count: 89,
        views_count: 8340,
        user_likes: 0,
        date: 1708569600,
        last_updated: '2024-02-12T22:30:00.000Z',
        vk_link: 'https://vk.com/wall-123456_12348'
    },
    {
        id: '5',
        vk_id: 12349,
        text: 'Поздравляем всех с наступающими праздниками! Желаем вам счастья, здоровья и успехов!',
        likes_count: 78,
        comments_count: 4,
        reposts_count: 2,
        views_count: 950,
        user_likes: 0,
        date: 1708483200,
        last_updated: '2024-02-11T15:20:00.000Z',
        vk_link: 'https://vk.com/wall-123456_12349'
    }
];

// Компонент: Аннотированная таблица постов
export const PostsTableAnatomy: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Зона 1: Панель поиска */}
            <div className="relative">
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-grow">
                            <input 
                                type="text" 
                                placeholder="Поиск по тексту..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md"
                                disabled
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md text-gray-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    1. Панель поиска
                </div>
            </div>

            {/* Зона 2: Заголовки таблицы */}
            <div className="relative">
                <div className="bg-gray-50 border-2 border-green-400 rounded-lg p-3">
                    <div className="grid grid-cols-9 gap-2 text-xs font-medium text-gray-500 uppercase">
                        <div className="w-16">Медиа</div>
                        <div className="col-span-2">Текст</div>
                        <div>Лайки</div>
                        <div>Коммент.</div>
                        <div>Репосты</div>
                        <div>Просмотры</div>
                        <div>Публ.</div>
                        <div>Ссылка</div>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    2. Заголовки колонок
                </div>
            </div>

            {/* Зона 3: Строки постов */}
            <div className="relative">
                <div className="bg-white border-2 border-purple-400 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-10 h-10 rounded bg-gray-200"></div>
                        <div className="flex-1 truncate">Друзья! Рады сообщить вам об открытии...</div>
                        <span className="text-red-500 font-medium">245</span>
                        <span className="text-gray-700">18</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <div className="w-10 h-10 rounded bg-gray-200"></div>
                        <div className="flex-1 truncate">Скидки до 50% на все товары...</div>
                        <span className="text-gray-700 font-medium">89</span>
                        <span className="text-gray-700">5</span>
                    </div>
                </div>
                <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                    3. Строки постов
                </div>
            </div>

            {/* Зона 4: Индикатор загрузки */}
            <div className="relative">
                <div className="bg-indigo-50 border-2 border-indigo-400 rounded-lg p-4 text-center">
                    <div className="inline-block h-6 w-6 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
                <div className="absolute -top-3 left-4 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                    4. Загрузка следующих постов
                </div>
            </div>
        </div>
    );
};

// Компонент: Строка поста с счётчиками
export const PostRow: React.FC<{ post: MockPost; onClick?: () => void }> = ({ post, onClick }) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            {/* Медиа */}
            <td className="px-4 py-3">
                {post.image_url ? (
                    <div 
                        className="w-10 h-10 rounded overflow-hidden border border-gray-200 shadow-sm cursor-pointer"
                        onClick={onClick}
                    >
                        <img 
                            src={post.image_url} 
                            alt="" 
                            className="w-full h-full object-cover hover:scale-110 transition-transform" 
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 border border-gray-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </td>

            {/* Текст */}
            <td className="px-4 py-3 max-w-[250px]">
                <div className="text-gray-800 text-sm truncate" title={post.text}>
                    {post.text || <span className="text-gray-400 italic">Текст отсутствует</span>}
                </div>
            </td>

            {/* Лайки */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className={`font-medium text-sm ${post.user_likes ? 'text-red-500' : 'text-gray-700'}`}>
                        {post.likes_count.toLocaleString('ru-RU')}
                    </span>
                </div>
            </td>

            {/* Комментарии */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                        {post.comments_count.toLocaleString('ru-RU')}
                    </span>
                </div>
            </td>

            {/* Репосты */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span className="text-gray-700 text-sm">
                        {post.reposts_count.toLocaleString('ru-RU')}
                    </span>
                </div>
            </td>

            {/* Просмотры */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-500 text-sm">
                        {post.views_count.toLocaleString('ru-RU')}
                    </span>
                </div>
            </td>

            {/* Дата публикации */}
            <td className="px-4 py-3">
                <span className="text-xs text-gray-600">{formatDate(post.date)}</span>
            </td>

            {/* Ссылка на VK */}
            <td className="px-4 py-3">
                <a 
                    href={post.vk_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-400 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                    title="Открыть пост в VK"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </td>
        </tr>
    );
};

// Компонент: Таблица постов с данными
export const PostsTableDemo: React.FC = () => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">
                                Медиа
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                                Текст
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">
                                Лайки
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">
                                Коммент.
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">
                                Репосты
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">
                                Просмотры
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36 bg-gray-50">
                                Публ.
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">
                                Ссылка
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {mockPosts.map(post => (
                            <PostRow 
                                key={post.id} 
                                post={post} 
                                onClick={() => post.image_url && setPreviewImage(post.image_url)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно превью изображения */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]" 
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-4/5 p-4" onClick={e => e.stopPropagation()}>
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        <button 
                            onClick={() => setPreviewImage(null)} 
                            className="absolute -top-2 -right-2 bg-gray-800 bg-opacity-75 text-white rounded-full p-2 hover:bg-black transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// Компонент: Состояния таблицы постов
export const PostsTableStatesDemo: React.FC = () => {
    const [state, setState] = useState<'loading' | 'empty' | 'data'>('loading');

    return (
        <div className="space-y-4">
            {/* Панель переключения */}
            <div className="flex gap-2 justify-center">
                <button
                    onClick={() => setState('loading')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'loading'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Загрузка
                </button>
                <button
                    onClick={() => setState('empty')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'empty'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Пустой список
                </button>
                <button
                    onClick={() => setState('data')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        state === 'data'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    С данными
                </button>
            </div>

            {/* Отображение состояния */}
            <div className="bg-white rounded-lg shadow border border-gray-200 min-h-[200px] flex items-center justify-center">
                {state === 'loading' && (
                    <div className="p-8 text-center text-gray-500">
                        <div className="inline-block h-8 w-8 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p>Загрузка постов...</p>
                    </div>
                )}

                {state === 'empty' && (
                    <div className="p-12 text-center text-gray-400">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium">Список пуст</p>
                        <p className="text-sm mt-1">Посты появятся после синхронизации</p>
                    </div>
                )}

                {state === 'data' && (
                    <div className="w-full p-4">
                        <PostsTableDemo />
                    </div>
                )}
            </div>
        </div>
    );
};

// Компонент: Интерактивный поиск
export const PostsSearchDemo: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    const filteredPosts = mockPosts.filter(post => {
        const searchLower = searchQuery.toLowerCase();
        return !searchQuery || post.text.toLowerCase().includes(searchLower);
    });

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    return (
        <div className="space-y-4">
            {/* Панель поиска */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Поиск по тексту..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                        title="Обновить список постов"
                    >
                        {isRefreshing ? (
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-indigo-500 rounded-full animate-spin"></div>
                        ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Счётчик результатов */}
                <div className="mt-3 text-sm text-gray-600">
                    Найдено постов: <strong>{filteredPosts.length}</strong> из {mockPosts.length}
                </div>
            </div>

            {/* Таблица с отфильтрованными данными */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">Медиа</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Текст</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">Лайки</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">Коммент.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">Ссылка</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        {post.image_url ? (
                                            <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                                                <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded bg-gray-100"></div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 max-w-[300px]">
                                        <div className="text-gray-800 text-sm truncate">{post.text}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-sm font-medium ${post.user_likes ? 'text-red-500' : 'text-gray-700'}`}>
                                            {post.likes_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-700">{post.comments_count}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a 
                                            href={post.vk_link} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-400 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                                    Постов с таким текстом не найдено
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Компонент: Демонстрация Infinite Scroll
export const PostsInfiniteScrollDemo: React.FC = () => {
    const [items, setItems] = useState<MockPost[]>(mockPosts.slice(0, 2));
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const loadMore = () => {
        if (isLoading || items.length >= mockPosts.length) return;
        
        setIsLoading(true);
        
        setTimeout(() => {
            const newItems = mockPosts.slice(items.length, items.length + 2);
            setItems([...items, ...newItems]);
            setPage(page + 1);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                    <strong>Как работает:</strong> Прокрутите таблицу вниз до конца. Когда индикатор загрузки появится — 
                    автоматически загрузятся следующие 2 поста. Так работает "бесконечная прокрутка".
                </p>
            </div>

            <div className="bg-gray-100 p-2 rounded text-sm text-gray-700">
                Загружено: <strong>{items.length}</strong> из {mockPosts.length} постов | Страница: <strong>{page}</strong>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50">Медиа</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Текст</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">Лайки</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 bg-gray-50">Просмотры</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {items.map(post => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    {post.image_url ? (
                                        <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                                            <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-gray-100"></div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="text-sm text-gray-800 line-clamp-2">{post.text}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-sm font-medium ${post.user_likes ? 'text-red-500' : 'text-gray-700'}`}>
                                        {post.likes_count}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-sm text-gray-500">{post.views_count.toLocaleString('ru-RU')}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Индикатор загрузки / Триггер */}
                {items.length < mockPosts.length && (
                    <div 
                        className="h-16 w-full flex justify-center items-center py-4 border-t border-gray-100"
                        onMouseEnter={loadMore}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="inline-block h-6 w-6 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
                                <span className="text-sm">Загрузка...</span>
                            </div>
                        ) : (
                            <button
                                onClick={loadMore}
                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Загрузить ещё
                            </button>
                        )}
                    </div>
                )}

                {items.length >= mockPosts.length && (
                    <div className="py-4 text-center text-sm text-gray-400 border-t border-gray-100">
                        Все посты загружены
                    </div>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// КОМПОНЕНТЫ ДЛЯ СТРАНИЦЫ "СИНХРОНИЗАЦИЯ ВЗАИМОДЕЙСТВИЙ" (3.2.6)
// =====================================================================

// 1. Демонстрация карточки списка с кнопкой refresh
export const SyncInteractionsButtonDemo: React.FC = () => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div className="max-w-sm">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative">
                {/* Аннотация */}
                <div className="absolute -top-3 -right-3 bg-purple-100 border-2 border-purple-400 rounded-full px-3 py-1 text-xs font-bold text-purple-700 animate-pulse">
                    Кнопка здесь!
                </div>

                {/* Заголовок карточки */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <h3 className="text-sm font-semibold text-gray-700">Лайкали</h3>
                    </div>
                    <button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`p-1.5 rounded-md transition-colors ${
                            isHovered ? 'bg-gray-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title="Собрать взаимодействия"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* Счётчик */}
                <div className="text-3xl font-bold text-gray-800 mb-1">156</div>
                <div className="text-xs text-gray-500">Обновлено: 25.02, 14:30</div>
            </div>
        </div>
    );
};

// 2. Полное модальное окно синхронизации (интерактивное)
export const InteractionSyncModalDemo: React.FC = () => {
    const [dateFrom, setDateFrom] = React.useState(() => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
    });
    const [dateTo, setDateTo] = React.useState(() => new Date().toISOString().split('T')[0]);
    const [isSyncing, setIsSyncing] = React.useState(false);

    const handlePreset = (days: number) => {
        const today = new Date();
        const fromDate = new Date();
        if (days === 365 * 2) {
            // Прошлый год
            fromDate.setFullYear(today.getFullYear() - 1, 0, 1);
            const toDate = new Date(today.getFullYear() - 1, 11, 31);
            setDateFrom(fromDate.toISOString().split('T')[0]);
            setDateTo(toDate.toISOString().split('T')[0]);
        } else {
            fromDate.setDate(today.getDate() - days);
            setDateFrom(fromDate.toISOString().split('T')[0]);
            setDateTo(today.toISOString().split('T')[0]);
        }
    };

    const handleStart = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            alert('Синхронизация завершена! (демонстрация)');
        }, 2000);
    };

    const hasError = new Date(dateFrom) > new Date(dateTo);

    return (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Сбор активностей</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <p className="text-sm text-gray-600">
                    Выберите период, за который нужно собрать лайки, комментарии и репосты со стены сообщества.
                </p>

                {/* Preset кнопки */}
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handlePreset(7)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors">
                            Неделя
                        </button>
                        <button onClick={() => handlePreset(30)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors">
                            Месяц
                        </button>
                        <button onClick={() => handlePreset(90)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors">
                            Квартал
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handlePreset(180)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors whitespace-nowrap">
                            Полгода
                        </button>
                        <button onClick={() => handlePreset(365)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors">
                            Год
                        </button>
                        <button onClick={() => handlePreset(365 * 2)} className="flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors whitespace-nowrap">
                            Прошлый год
                        </button>
                    </div>
                </div>

                {/* Date pickers */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">С</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            max={dateTo}
                            className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">По</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            min={dateFrom}
                            className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Ошибка валидации */}
                {hasError && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                        Дата начала не может быть позже даты окончания.
                    </div>
                )}

                {/* Информационный блок */}
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-100">
                    <p className="font-medium text-blue-800 mb-1">Важно:</p>
                    <ul className="space-y-1">
                        <li>• Сбор репостов требует прав администратора.</li>
                        <li>• Обновляются данные сразу во всех списках (Лайкали, Комментировали, Репостили).</li>
                        <li>• При выборе большого периода (год и более) процесс может занять несколько минут.</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
                <button
                    disabled={isSyncing}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Отмена
                </button>
                <button
                    onClick={handleStart}
                    disabled={isSyncing || hasError}
                    className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
                >
                    {isSyncing && <div className="loader border-white border-t-transparent h-4 w-4 mr-2"></div>}
                    {isSyncing ? 'Сбор данных...' : 'Запустить'}
                </button>
            </div>
        </div>
    );
};

// 3. Демонстрация фаз прогресса синхронизации
export const SyncProgressStatesDemo: React.FC = () => {
    const [currentPhase, setCurrentPhase] = React.useState(0);

    const phases = [
        { label: 'Старт', description: 'Подготовка, сбор токенов, получение списка постов' },
        { label: '15/50', description: 'Сбор данных с VK API — обработано 15 из 50 постов' },
        { label: 'Запись', description: 'Сохранение собранных данных в базу данных' },
        { label: 'Готово', description: 'Синхронизация завершена успешно' },
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhase((prev) => (prev + 1) % phases.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-4">
            {/* Визуализация на кнопке */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-sm font-medium text-gray-700 mb-4">Состояние на кнопке refresh:</p>
                <div className="flex items-center gap-3">
                    <button className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md text-gray-600 shadow-sm">
                        <div className="flex items-center gap-1">
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                            <span className="text-xs text-gray-500">{phases[currentPhase].label}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Таблица фаз */}
            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Фаза</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Что происходит</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {phases.map((phase, idx) => (
                        <tr key={idx} className={currentPhase === idx ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                            <td className="px-4 py-3">
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                                    {phase.label}
                                </code>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{phase.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// 4. Сравнение результатов до/после синхронизации
export const SyncResultsComparisonDemo: React.FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {/* До синхронизации */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-3">До синхронизации</div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Лайкали</span>
                        <span className="text-2xl font-bold text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Комментировали</span>
                        <span className="text-2xl font-bold text-gray-400">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Репостили</span>
                        <span className="text-2xl font-bold text-gray-400">—</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-3">Обновлено: —</div>
                </div>
            </div>

            {/* После синхронизации */}
            <div className="bg-white rounded-lg border-2 border-green-400 p-4">
                <div className="text-xs font-semibold text-green-700 uppercase mb-3">После синхронизации</div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Лайкали</span>
                        <span className="text-2xl font-bold text-green-600">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Комментировали</span>
                        <span className="text-2xl font-bold text-green-600">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Репостили</span>
                        <span className="text-2xl font-bold text-green-600">8</span>
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-3">Обновлено: 25.02, 14:30</div>
                </div>
            </div>
        </div>
    );
};

// 5. Примеры ошибок синхронизации
export const SyncErrorsDemo: React.FC = () => {
    const errors = [
        {
            type: 'Нет админских прав',
            message: 'Нет токенов с правами администратора для сбора репостов.',
            solution: 'Добавьте токен администратора в настройках проекта',
            color: 'red',
        },
        {
            type: 'Неверный период',
            message: 'Дата начала не может быть позже даты окончания.',
            solution: 'Проверьте выбранные даты в модальном окне',
            color: 'orange',
        },
        {
            type: 'Проект не найден',
            message: 'Project not found',
            solution: 'Проект был удалён или у вас нет доступа',
            color: 'red',
        },
    ];

    return (
        <div className="space-y-3">
            {errors.map((error, idx) => (
                <div key={idx} className={`bg-${error.color}-50 border border-${error.color}-200 rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                        <svg className={`h-5 w-5 text-${error.color}-600 flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <h4 className={`font-semibold text-${error.color}-900 mb-1`}>{error.type}</h4>
                            <p className={`text-sm text-${error.color}-700 mb-2`}>{error.message}</p>
                            <p className={`text-xs text-${error.color}-600`}>
                                <strong>Решение:</strong> {error.solution}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// 6. Сравнение двух кнопок: синхронизация vs обновление профилей
export const TwoButtonsComparisonDemo: React.FC = () => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* Кнопка синхронизации */}
                <div className="bg-white rounded-lg border-2 border-indigo-300 p-4">
                    <div className="flex items-center justify-center mb-3">
                        <button className="p-1.5 rounded-md bg-indigo-50 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-indigo-900 text-center mb-2">Синхронизация взаимодействий</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Собирает новые лайки/комментарии/репосты</li>
                        <li>✓ Требует выбор периода</li>
                        <li>✓ Обновляет все 3 списка сразу</li>
                        <li>✓ 3-10 минут выполнения</li>
                    </ul>
                </div>

                {/* Кнопка обновления профилей */}
                <div className="bg-white rounded-lg border-2 border-green-300 p-4">
                    <div className="flex items-center justify-center mb-3">
                        <button className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md text-gray-600 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-green-900 text-center mb-2">Обновление профилей</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li>✓ Обновляет только данные профилей</li>
                        <li>✓ Не требует выбор периода</li>
                        <li>✓ Быстрая операция (до 1 минуты)</li>
                        <li>✓ City, bdate, platform, статусы</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// 7. Визуализация трёх типов взаимодействий
export const InteractionTypesDemo: React.FC = () => {
    const types = [
        {
            name: 'Лайки',
            icon: '❤️',
            color: 'red',
            api: 'likes.getList',
            description: 'Кто лайкнул посты сообщества',
            limit: '1000 за пост (быстрый сбор)',
        },
        {
            name: 'Комментарии',
            icon: '💬',
            color: 'blue',
            api: 'wall.getComments',
            description: 'Кто комментировал посты',
            limit: '100 за пост (быстрый сбор)',
        },
        {
            name: 'Репосты',
            icon: '🔄',
            color: 'green',
            api: 'wall.getReposts',
            description: 'Кто репостил записи',
            limit: '1000 за пост (требуются админские права)',
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {types.map((type, idx) => (
                <div key={idx} className={`bg-${type.color}-50 border border-${type.color}-200 rounded-lg p-4 text-center`}>
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <h4 className={`font-bold text-${type.color}-900 mb-2`}>{type.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{type.description}</p>
                    <div className={`text-xs bg-${type.color}-100 text-${type.color}-800 px-2 py-1 rounded mb-2`}>
                        <code>{type.api}</code>
                    </div>
                    <p className="text-xs text-gray-500">{type.limit}</p>
                </div>
            ))}
        </div>
    );
};

// 8. Выбор периода с preset'ами (интерактивный)
export const DatePeriodPickerDemo: React.FC = () => {
    const [selectedPreset, setSelectedPreset] = React.useState<string | null>('week');

    const presets = [
        { id: 'week', label: 'Неделя', days: 7 },
        { id: 'month', label: 'Месяц', days: 30 },
        { id: 'quarter', label: 'Квартал', days: 90 },
        { id: 'halfyear', label: 'Полгода', days: 180 },
        { id: 'year', label: 'Год', days: 365 },
        { id: 'lastyear', label: 'Прошлый год', days: 0, special: true },
    ];

    return (
        <div className="space-y-4">
            <p className="text-sm text-gray-600">Нажмите на preset, чтобы быстро выбрать период:</p>
            <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    {presets.slice(0, 3).map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => setSelectedPreset(preset.id)}
                            className={`py-2 text-xs font-medium rounded border transition-colors ${
                                selectedPreset === preset.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border-gray-200'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {presets.slice(3).map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => setSelectedPreset(preset.id)}
                            className={`py-2 text-xs font-medium rounded border transition-colors whitespace-nowrap ${
                                selectedPreset === preset.id
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border-gray-200'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Результат выбора */}
            {selectedPreset && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-indigo-900 mb-1">Выбранный период:</p>
                    <p className="text-sm text-indigo-700">
                        {presets.find(p => p.id === selectedPreset)?.special
                            ? 'С 1 января по 31 декабря прошлого года'
                            : `Последние ${presets.find(p => p.id === selectedPreset)?.days} дней`}
                    </p>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// ЭКСПОРТ ДАННЫХ ДЛЯ ИСПОЛЬЗОВАНИЯ В ДРУГИХ КОМПОНЕНТАХ
// =====================================================================

// Module exports are declared inline for each component above.
// The previous re-export block was removed because it duplicated
// the named exports and caused build errors in the bundler.
