
import React from 'react';
import { ListGroup, ListType, RefreshState } from '../../types';
import { ProjectListMeta } from '../../../../shared/types';
import { ListCard } from '../ListCard';
import { AppView } from '../../../../App';

interface ListsNavigationProps {
    activeGroup: ListGroup;
    activeList: ListType | null;
    meta: ProjectListMeta | null;
    refreshStates: Record<ListType, RefreshState>;
    onGroupChange: (group: ListGroup) => void;
    onTabChange: (type: ListType) => void;
    onRefreshList: (type: ListType) => void;
    onRefreshPostsWithLimit: (limit: '1000' | 'all') => void;
    activeView: AppView; // New Prop
}

export const ListsNavigation: React.FC<ListsNavigationProps> = ({
    activeGroup,
    activeList,
    meta,
    refreshStates,
    onGroupChange,
    onTabChange,
    onRefreshList,
    onRefreshPostsWithLimit,
    activeView
}) => {
    
    const groupButtonClass = (group: ListGroup) => `
        px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap
        ${activeGroup === group ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}
    `;
    
    const isSystemView = activeView === 'lists-system';
    const isAutomationView = activeView === 'lists-automations';

    return (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 overflow-x-auto custom-scrollbar">
            {isSystemView && (
                <div className="flex gap-1 mb-4 bg-gray-200 p-1 rounded-lg w-fit">
                    <button onClick={() => onGroupChange('subscribers')} className={groupButtonClass('subscribers')}>Подписчики</button>
                    <button onClick={() => onGroupChange('activities')} className={groupButtonClass('activities')}>Активности</button>
                    <button onClick={() => onGroupChange('other')} className={groupButtonClass('other')}>Прочее</button>
                </div>
            )}
            
            {isAutomationView && (
                <div className="flex gap-1 mb-4 bg-gray-200 p-1 rounded-lg w-fit">
                    <button onClick={() => onGroupChange('automations')} className={groupButtonClass('automations')}>Конкурс отзывов</button>
                    <button onClick={() => onGroupChange('other')} className={groupButtonClass('other')}>Прочее</button>
                </div>
            )}

            <div className="flex gap-4 min-w-max pb-2">
                {activeGroup === 'subscribers' && isSystemView && (
                    <>
                        <div className="w-40">
                            <ListCard title="Подписчики" count={meta?.subscribers_count || 0} lastUpdated={meta?.subscribers_last_updated}
                                isActive={activeList === 'subscribers'} onClick={() => onTabChange('subscribers')} colorClass="bg-indigo-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                                onRefresh={() => onRefreshList('subscribers')} isRefreshing={refreshStates['subscribers'].isRefreshing} loadingLabel={refreshStates['subscribers'].label}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="В рассылке" count={meta?.mailing_count || 0} lastUpdated={meta?.mailing_last_updated}
                                isActive={activeList === 'mailing'} onClick={() => onTabChange('mailing')} colorClass="bg-cyan-600"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg>}
                                onRefresh={() => onRefreshList('mailing')} isRefreshing={refreshStates['mailing'].isRefreshing} loadingLabel={refreshStates['mailing'].label}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="Вступившие (История)" count={meta?.history_join_count || 0} lastUpdated={meta?.history_join_last_updated}
                                isActive={activeList === 'history_join'} onClick={() => onTabChange('history_join')} colorClass="bg-teal-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
                                onRefresh={() => onRefreshList('history_join')} isRefreshing={refreshStates['history_join'].isRefreshing} loadingLabel={refreshStates['history_join'].label}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="Вышедшие (История)" count={meta?.history_leave_count || 0} lastUpdated={meta?.history_leave_last_updated}
                                isActive={activeList === 'history_leave'} onClick={() => onTabChange('history_leave')} colorClass="bg-orange-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 20a6 6 0 01-6-6v-1h12v1a6 6 0 01-6 6z" /></svg>}
                                onRefresh={() => onRefreshList('history_leave')} isRefreshing={refreshStates['history_leave'].isRefreshing} loadingLabel={refreshStates['history_leave'].label}
                            />
                        </div>
                    </>
                )}
                {activeGroup === 'activities' && isSystemView && (
                     <>
                        <div className="w-40">
                            <ListCard title="Лайкали" count={meta?.likes_count || 0} lastUpdated={meta?.likes_last_updated} 
                                isActive={activeList === 'likes'} onClick={() => onTabChange('likes')} colorClass="bg-pink-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
                                onRefresh={() => onRefreshList('likes')} isRefreshing={refreshStates['likes'].isRefreshing} loadingLabel={refreshStates['likes'].label}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="Комментировали" count={meta?.comments_count || 0} lastUpdated={meta?.comments_last_updated}
                                isActive={activeList === 'comments'} onClick={() => onTabChange('comments')} colorClass="bg-blue-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg>}
                                onRefresh={() => onRefreshList('comments')} isRefreshing={refreshStates['comments'].isRefreshing} loadingLabel={refreshStates['comments'].label}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="Репостили" count={meta?.reposts_count || 0} lastUpdated={meta?.reposts_last_updated}
                                isActive={activeList === 'reposts'} onClick={() => onTabChange('reposts')} colorClass="bg-purple-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>}
                                onRefresh={() => onRefreshList('reposts')} isRefreshing={refreshStates['reposts'].isRefreshing} loadingLabel={refreshStates['reposts'].label}
                            />
                        </div>
                     </>
                )}
                
                {/* Карточки автоматизаций показываются только в режиме 'lists-automations' */}
                {activeGroup === 'automations' && isAutomationView && (
                     <>
                        <div className="w-40">
                            <ListCard title="Конкурс: Победители" count={meta?.reviews_winners_count || 0} lastUpdated={undefined}
                                isActive={activeList === 'reviews_winners'} onClick={() => onTabChange('reviews_winners')} colorClass="bg-amber-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                            />
                        </div>
                        <div className="w-40">
                            <ListCard title="Конкурс: Участники" count={meta?.reviews_participants_count || 0} lastUpdated={undefined}
                                isActive={activeList === 'reviews_participants'} onClick={() => onTabChange('reviews_participants')} colorClass="bg-green-500"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                            />
                        </div>
                         <div className="w-40">
                            <ListCard title="Конкурс: Посты" count={meta?.reviews_posts_count || 0} lastUpdated={undefined}
                                isActive={activeList === 'reviews_posts'} onClick={() => onTabChange('reviews_posts')} colorClass="bg-indigo-400"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" /></svg>}
                            />
                        </div>
                     </>
                )}

                {activeGroup === 'other' && isAutomationView && (
                    <div className="flex items-center justify-center h-[160px] w-40 text-gray-400 text-sm italic border border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                        Раздел в разработке
                    </div>
                )}

                {activeGroup === 'other' && isSystemView && (
                     <>
                        <div className="w-40">
                            <ListCard 
                                title="Посты (История)" 
                                count={meta?.posts_count || 0} 
                                storedCount={meta?.stored_posts_count} 
                                lastUpdated={meta?.posts_last_updated}
                                isActive={activeList === 'posts'} 
                                onClick={() => onTabChange('posts')} 
                                colorClass="bg-indigo-800"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
                                isRefreshing={refreshStates['posts'].isRefreshing} 
                                loadingLabel={refreshStates['posts'].label}
                                refreshOptions={[
                                    { label: 'Обновить 1000 (быстро)', onClick: () => onRefreshPostsWithLimit('1000') },
                                    { label: 'Обновить всё (долго)', onClick: () => onRefreshPostsWithLimit('all') }
                                ]}
                            />
                        </div>
                         {/* NEW: Авторы постов */}
                        <div className="w-40">
                            <ListCard 
                                title="Авторы постов" 
                                count={(meta as any)?.authors_count || 0} 
                                lastUpdated={(meta as any)?.authors_last_updated}
                                isActive={activeList === 'authors'} 
                                onClick={() => onTabChange('authors')} 
                                colorClass="bg-violet-600"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                                // Обновление происходит автоматически вместе с постами, 
                                // поэтому кнопка рефреша здесь ведет на обновление постов
                                onRefresh={() => onRefreshPostsWithLimit('1000')}
                                isRefreshing={refreshStates['posts'].isRefreshing} // Используем статус обновления постов
                                loadingLabel={refreshStates['posts'].isRefreshing ? 'Обновление с постами...' : null}
                            />
                        </div>
                     </>
                )}
            </div>
        </div>
    );
};
