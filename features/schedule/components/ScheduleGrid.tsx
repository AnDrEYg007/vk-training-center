
import React, { useMemo } from 'react';
import { Note, GlobalVariableDefinition, ProjectGlobalVariableValue, SystemPost } from '../../../shared/types';
import { UnifiedPost } from '../hooks/useScheduleData'; // Импортируем новый объединенный тип
import { PostCard } from '../../posts/components/PostCard';
import { NoteCard } from '../../notes/components/NoteCard';
import { DayColumn } from './DayColumn';

interface ScheduleGridProps {
    weekDates: Date[];
    posts: UnifiedPost[];
    notes: Note[];
    noteVisibility: 'expanded' | 'collapsed' | 'hidden';
    tagVisibility: 'visible' | 'hidden';
    isSelectionMode: boolean;
    selectedPostIds: Set<string>;
    selectedNoteIds: Set<string>;
    highlightedPostId?: string | null;
    expandedPosts: Record<string, boolean>;
    dragActions: any;
    interactionActions: any;
    modalActions: any;
    globalVarDefs: GlobalVariableDefinition[];
    projectGlobalVarValues: ProjectGlobalVariableValue[];
    onNavigateToContest?: () => void; 
}

// Вспомогательная функция для получения последнего дня месяца
const getLastDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

// Вспомогательная функция для расчета следующей даты с учетом настроек
const addInterval = (date: Date, post: SystemPost): Date => {
    const interval = post.recurrence_interval || 1;
    const type = post.recurrence_type || 'days';
    const newDate = new Date(date);

    if (type === 'minutes') newDate.setMinutes(newDate.getMinutes() + interval);
    else if (type === 'hours') newDate.setHours(newDate.getHours() + interval);
    else if (type === 'days') newDate.setDate(newDate.getDate() + interval);
    else if (type === 'weeks') newDate.setDate(newDate.getDate() + (interval * 7));
    else if (type === 'months') {
        // Простой сдвиг месяца
        newDate.setMonth(newDate.getMonth() + interval);
        
        // Корректировка дня
        if (post.recurrence_is_last_day) {
             const lastDay = getLastDayOfMonth(newDate);
             newDate.setDate(lastDay);
        } else if (post.recurrence_fixed_day) {
             const lastDay = getLastDayOfMonth(newDate);
             newDate.setDate(Math.min(post.recurrence_fixed_day, lastDay));
        }
        // Если настроек нет, дата просто сдвигается, браузер сам обработает переполнение (например 31 янв + 1 мес -> 3 марта или 2 марта),
        // но для точности "в тот же день" лучше проверять переполнение
        else {
            // Логика "в тот же день" требует аккуратности. Если было 31-е, а в след месяце 30 дней, JS поставит 1-е число следующего за ним.
            // Обычно ожидается последний день месяца.
             const originalDay = date.getDate();
             const daysInNextMonth = getLastDayOfMonth(newDate);
             if (originalDay > daysInNextMonth) {
                 // Возвращаем на последний день, если перескочили
                 newDate.setDate(0); 
             }
        }
    }
    return newDate;
};

const ScheduleGrid: React.FC<ScheduleGridProps> = React.memo(({
    weekDates,
    posts,
    notes,
    noteVisibility,
    tagVisibility,
    isSelectionMode,
    selectedPostIds,
    selectedNoteIds,
    highlightedPostId,
    expandedPosts,
    dragActions,
    interactionActions,
    modalActions,
    globalVarDefs,
    projectGlobalVarValues,
    onNavigateToContest,
}) => {
    const now = new Date();

    // Генерация "Призрачных" постов для циклических публикаций
    const postsWithGhosts = useMemo(() => {
        const ghosts: UnifiedPost[] = [];
        const viewStart = weekDates[0];
        const viewEnd = new Date(weekDates[6]);
        viewEnd.setHours(23, 59, 59, 999);

        // 1. Фильтруем базовый список постов:
        // Убираем системные посты, у которых is_active === false (выключенная автоматизация)
        const activeBasePosts = posts.filter(p => {
             if (p.postType === 'system' && p.is_active === false) {
                 return false;
             }
             return true;
        });

        // 2. На основе активных постов ищем циклические для генерации призраков
        const cyclicPosts = activeBasePosts.filter(p => 
            p.postType === 'system' && 
            'is_cyclic' in p && p.is_cyclic && 
            p.status !== 'error' && p.status !== 'possible_error' && // Исключаем ошибочные, чтобы не спамить
            p.recurrence_interval && p.recurrence_interval > 0
        ) as SystemPost[];

        cyclicPosts.forEach(sourcePost => {
            let currentDate = new Date(sourcePost.publication_date);
            let nextDate = addInterval(currentDate, sourcePost);
            
            // Счетчик уже созданных постов в этой цепочке.
            // Начинаем с 1, так как sourcePost - это первое вхождение.
            let occurrencesSoFar = 1; 
            
            // Ограничитель цикла на случай багов (не более 100 призраков на один пост в рамках недели)
            let safetyCounter = 0;

            // Генерируем призраков пока дата попадает в текущий вид ИЛИ пока не достигли лимитов
            while (nextDate <= viewEnd && safetyCounter < 100) {
                
                // 1. Проверка ограничения по КОЛИЧЕСТВУ
                if (sourcePost.recurrence_end_type === 'count' && sourcePost.recurrence_end_count) {
                    // Если мы уже достигли лимита (включая исходный пост), останавливаемся
                    if (occurrencesSoFar >= sourcePost.recurrence_end_count) break;
                }

                // 2. Проверка ограничения по ДАТЕ
                if (sourcePost.recurrence_end_type === 'date' && sourcePost.recurrence_end_date) {
                    const endDate = new Date(sourcePost.recurrence_end_date);
                    // Устанавливаем конец дня ограничивающей даты
                    endDate.setHours(23, 59, 59, 999); 
                    
                    // Если следующая дата вышла за предел, останавливаемся
                    if (nextDate > endDate) break;
                }

                // Добавляем призрака только если он попадает в видимую область (>= начала недели)
                if (nextDate >= viewStart) {
                    ghosts.push({
                        ...sourcePost,
                        id: `ghost-${sourcePost.id}-${nextDate.getTime()}`,
                        date: nextDate.toISOString(),
                        isGhost: true,
                        postType: 'system', // Важно указать тип для TS
                        // Ссылка на оригинал для открытия модалки
                        originalId: sourcePost.id,
                        // Важно: копируем тип поста, чтобы PostCard знал, как его рендерить
                        post_type: sourcePost.post_type,
                        // Важно: копируем параметры AI, чтобы призрак отображался как AI пост
                        aiGenerationParams: sourcePost.aiGenerationParams,
                        ai_generation_params: (sourcePost as any).ai_generation_params,
                        // Сбрасываем статус, так как это будущее событие
                        status: 'pending_publication' 
                    } as UnifiedPost);
                }
                
                // Готовим данные для следующей итерации
                nextDate = addInterval(nextDate, sourcePost);
                occurrencesSoFar++;
                safetyCounter++;
            }
        });

        // Возвращаем отфильтрованные реальные посты + призраки
        return [...activeBasePosts, ...ghosts];
    }, [posts, weekDates]);


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 flex-grow overflow-y-auto custom-scrollbar px-4 pb-4">
            {weekDates.map((date, i) => {
                const dayPosts = postsWithGhosts.filter(p => new Date(p.date).toDateString() === date.toDateString());
                const dayNotes = notes.filter(n => new Date(n.date).toDateString() === date.toDateString());
                
                const dayItems = [
                    ...dayNotes.map(note => ({ type: 'note' as const, data: note, date: new Date(note.date) })),
                    ...dayPosts.map(post => ({ type: 'post' as const, data: post, date: new Date(post.date) }))
                ].sort((a, b) => a.date.getTime() - b.date.getTime());

                return (
                    <DayColumn.Content
                        key={`content-${i}`}
                        date={date}
                        onDrop={(e, targetDay) => dragActions.handleDrop(e, targetDay, (info: any, date: any) => {
                            modalActions.setMovingItemInfo(info);
                            modalActions.setDropTargetDate(date);
                        })}
                        onDoubleClick={() => modalActions.handleOpenCreateNoteModal(date)}
                    >
                        {dayItems.map((item, index) => {
                            if (item.type === 'note') {
                                if (noteVisibility === 'hidden') return null;
                                return (
                                    <NoteCard
                                        key={item.data.id}
                                        note={item.data}
                                        isExpanded={noteVisibility === 'expanded'}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedNoteIds.has(item.data.id)}
                                        onView={modalActions.setViewingNote}
                                        onEdit={modalActions.setEditingNote}
                                        onDelete={modalActions.setDeletingNote}
                                        onCopy={modalActions.handleCopyNote}
                                        onDragStart={(e, note) => dragActions.handleNoteDragStart(e, note)}
                                        onDragEnd={dragActions.handleDragEnd}
                                        onToggleSelect={interactionActions.handleToggleNoteSelection}
                                        animationIndex={index}
                                    />
                                );
                            }
                            if (item.type === 'post') {
                                const post = item.data;
                                const isSystem = post.postType === 'system';
                                const systemPostStatus = isSystem && 'status' in post ? post.status : undefined;
                                const isGhost = 'isGhost' in post ? post.isGhost : false;
                                
                                // Проверка типов системных постов
                                const isContestWinner = isSystem && ('post_type' in post && post.post_type === 'contest_winner');
                                const isAiFeed = isSystem && ('post_type' in post && post.post_type === 'ai_feed');

                                // Обработчики кликов
                                const handleClick = () => {
                                    if (isGhost) {
                                        // @ts-ignore
                                        const originalPost = posts.find(p => p.id === post.originalId);
                                        if (originalPost) {
                                            // FIX: Safe access to post_type
                                            if (originalPost.postType === 'system' && originalPost.post_type === 'contest_winner') {
                                                modalActions.setViewingContestPost(originalPost);
                                            } else if (originalPost.postType === 'system' && originalPost.post_type === 'ai_feed') {
                                                modalActions.setViewingAiFeedPost(originalPost);
                                            } else {
                                                modalActions.setEditingPost(originalPost);
                                            }
                                        }
                                    } else {
                                        if (isContestWinner) modalActions.setViewingContestPost(post);
                                        else if (isAiFeed) modalActions.setViewingAiFeedPost(post);
                                        else modalActions.setViewingPost(post); // Просмотр (а не редактирование) по умолчанию для обычного клика
                                    }
                                };
                                
                                // Для кнопки редактирования (карандаш)
                                const handleEdit = () => {
                                     if (isContestWinner) modalActions.setViewingContestPost(post);
                                     else if (isAiFeed) modalActions.setViewingAiFeedPost(post); // AI посты тоже открываем в превью
                                     else modalActions.setEditingPost(post);
                                };
                                
                                return (
                                    <PostCard 
                                        key={post.id}
                                        post={post}
                                        isSystemPost={isSystem}
                                        systemPostStatus={systemPostStatus}
                                        isExpanded={!!expandedPosts[post.id]}
                                        isPublished={!isSystem && new Date(post.date) < now}
                                        isSelectionMode={isSelectionMode}
                                        isSelected={selectedPostIds.has(post.id)}
                                        onToggleExpand={interactionActions.toggleExpandPost}
                                        onView={handleClick}
                                        onEdit={handleEdit}
                                        onCopy={modalActions.setCopyingPost}
                                        onDelete={modalActions.setDeletingPost}
                                        onPublishNow={modalActions.setPublishingPost}
                                        onMoveToScheduled={modalActions.setMovingToScheduledPost}
                                        onConfirmPublication={modalActions.setConfirmingPublicationPost}
                                        onCancelPublicationCheck={modalActions.setCancellingPublicationPost}
                                        onDragStart={(e, p) => dragActions.handlePostDragStart(e, p)}
                                        onDragEnd={dragActions.handleDragEnd}
                                        onToggleSelect={interactionActions.handleTogglePostSelection}
                                        animationIndex={index}
                                        showTags={tagVisibility === 'visible'}
                                        globalVarDefs={globalVarDefs}
                                        globalVarValues={projectGlobalVarValues}
                                        isHighlighted={highlightedPostId === post.id}
                                    />
                                );
                            }
                            return null;
                        })}
                    </DayColumn.Content>
                );
            })}
        </div>
    );
});

export default ScheduleGrid;
