import React, { DragEvent, useRef, useMemo } from 'react';
import { ScheduledPost, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../shared/types';
import { ActionsDropdown } from './ActionsDropdown';
import { usePostCardActions } from '../hooks/usePostCardActions'; 
import { ImageGrid } from './postcard/ImageGrid'; 
import { AttachmentsDisplay } from './postcard/Attachments'; 
import { PostTags } from './postcard/PostTags'; 


export const PostCard: React.FC<{
    post: ScheduledPost | (SystemPost & { date: string; isGhost?: boolean });
    isSystemPost?: boolean;
    systemPostStatus?: 'pending_publication' | 'publishing' | 'error' | 'possible_error';
    isExpanded: boolean;
    isPublished: boolean;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleExpand: (id: string) => void;
    onView: (post: ScheduledPost | SystemPost) => void;
    onEdit: (post: ScheduledPost) => void;
    onCopy: (post: ScheduledPost) => void;
    onDelete: (post: ScheduledPost | SystemPost) => void;
    onPublishNow: (post: ScheduledPost) => void;
    onMoveToScheduled?: (post: SystemPost) => void;
    onConfirmPublication?: (post: SystemPost) => void;
    onCancelPublicationCheck?: (post: SystemPost) => void;
    onDragStart: (e: DragEvent<HTMLDivElement>, post: ScheduledPost | SystemPost) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
    onToggleSelect: (id: string) => void;
    animationIndex?: number;
    showTags?: boolean;
    globalVarDefs?: GlobalVariableDefinition[];
    globalVarValues?: ProjectGlobalVariableValue[];
    isHighlighted?: boolean;
}> = React.memo(({ post, isSystemPost, systemPostStatus, isExpanded, isPublished, isSelectionMode, isSelected, onToggleExpand, onView, onEdit, onCopy, onDelete, onPublishNow, onMoveToScheduled, onConfirmPublication, onCancelPublicationCheck, onDragStart, onDragEnd, onToggleSelect, animationIndex = 0, showTags = true, globalVarDefs, globalVarValues, isHighlighted }) => {
    
    const isSystemError = isSystemPost && (systemPostStatus === 'error' || systemPostStatus === 'possible_error');
    const isSystemPublishing = isSystemPost && systemPostStatus === 'publishing';
    const isGhost = 'isGhost' in post && post.isGhost;
    const isCyclic = 'is_cyclic' in post && post.is_cyclic;
    
    // Определяем типы автоматизаций
    const isContestWinner = isSystemPost && 'post_type' in post && post.post_type === 'contest_winner';
    const isAiFeed = isSystemPost && 'post_type' in post && post.post_type === 'ai_feed';
    const isGeneralContestStart = isSystemPost && 'post_type' in post && (post.post_type === 'GENERAL_CONTEST_START' || post.post_type === 'general_contest_start');
    const isGeneralContestEnd = isSystemPost && 'post_type' in post && (post.post_type === 'GENERAL_CONTEST_END' || post.post_type === 'general_contest_result');
    
    const isGeneralContest = isGeneralContestStart || isGeneralContestEnd;
    const isAutomation = isContestWinner || isAiFeed || isGeneralContest;

    const actionsContainerRef = useRef<HTMLDivElement>(null);

    // Вся логика действий теперь в кастомном хуке
    const { visibleActions, hiddenActions, availableActions } = usePostCardActions({
        post, isSystemPost, systemPostStatus, isPublished, 
        onPublishNow: onPublishNow as (post: ScheduledPost) => void, 
        onMoveToScheduled, onConfirmPublication, 
        onCopy: onCopy as (post: ScheduledPost) => void, 
        onEdit: onEdit as (post: ScheduledPost) => void, 
        onDelete, actionsContainerRef
    });
    
    // Для постов автоматизации убираем действия, кроме просмотра (который будет вести на настройки/превью)
    const displayActions = isAutomation ? [] : visibleActions;
    const displayHiddenActions = isAutomation ? [] : hiddenActions;
    const displayAvailableActions = isAutomation ? [] : availableActions;

    // Новая логика: подстановка значений глобальных переменных для превью
    const displayText = useMemo(() => {
        if (isSystemPost && globalVarDefs && globalVarValues) {
            const definitionsMap = new Map(globalVarDefs.map(def => [def.placeholder_key, def.id]));
            const valuesMap = new Map(globalVarValues.map(val => [val.definition_id, val.value]));
            
            return post.text.replace(/\{global_(\w+)\}/g, (match, key) => {
                const defId = definitionsMap.get(key);
                if (defId && valuesMap.has(defId)) {
                    return valuesMap.get(defId) || '';
                }
                return ''; 
            });
        }
        return post.text;
    }, [post.text, isSystemPost, globalVarDefs, globalVarValues]);
    
    const isDraggable = !isSelectionMode && !isSystemPublishing && !isGhost && !isAutomation;
    
    // Стилизация контейнера
    let borderClass = 'border-gray-200';
    let bgClass = 'bg-white';
    let ringClass = '';

    if (isSelected) {
        ringClass = 'ring-2 ring-indigo-500 border-transparent';
    } else if (isContestWinner) {
        // Уникальный стиль для конкурса (фиолетовый/золотой оттенок)
        borderClass = 'border border-fuchsia-300';
        bgClass = 'bg-fuchsia-50/40';
        if (isGhost) {
            bgClass = 'bg-fuchsia-50/20 opacity-70';
            borderClass = 'border border-fuchsia-200 border-dashed';
        }
    } else if (isGeneralContestStart) {
        // Стиль для старта универсального конкурса (голубой/небесный)
        borderClass = 'border border-sky-300';
        bgClass = 'bg-sky-50/40 text-sky-900';
        if (isGhost) {
            bgClass = 'bg-sky-50/20 opacity-70';
            borderClass = 'border border-sky-200 border-dashed';
        }
    } else if (isGeneralContestEnd) {
        // Стиль для итогов универсального конкурса (оранжевый/золотой)
        borderClass = 'border border-orange-300';
        bgClass = 'bg-orange-50/40 text-orange-900';
        if (isGhost) {
            bgClass = 'bg-orange-50/20 opacity-70';
            borderClass = 'border border-orange-200 border-dashed';
        }
    } else if (isAiFeed) {
        // Уникальный стиль для AI Feed (индиго/синий, более технологичный)
        borderClass = 'border border-indigo-300';
        bgClass = 'bg-indigo-50/40';
        if (isGhost) {
            bgClass = 'bg-indigo-50/20 opacity-70';
            borderClass = 'border border-indigo-200 border-dashed';
        }
    } else if (isGhost) {
        bgClass = 'bg-gray-50 opacity-60';
        borderClass = 'border border-indigo-200 border-dashed';
    } else if (isSystemPost) {
        borderClass = 'border border-dashed border-gray-400';
    } else if (isSystemError) {
        borderClass = 'border border-red-400';
    }

    const containerClasses = `relative group p-2.5 rounded-lg border shadow-sm text-xs 
        ${bgClass} ${borderClass} ${ringClass}
        ${isHighlighted ? 'ring-4 ring-cyan-300 ring-opacity-70 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10 transition-shadow duration-300 ease-in-out' : ''}
        ${isDraggable ? 'cursor-move' : ''} 
        ${isSelectionMode ? 'cursor-pointer' : ''} 
        hover:shadow-md transition-all duration-200 
        ${isGhost ? '' : 'animate-fade-in-up'}
    `;
    
    // Обработчик клика
    const handleClick = () => {
        if (isSelectionMode) {
            onToggleSelect(post.id);
        } else {
            onView(post);
        }
    };

    return (
        <div 
            draggable={isDraggable}
            onDragStart={(e) => {
                if (isSelectionMode) {
                    e.preventDefault();
                    return;
                }
                onDragStart(e, post);
            }}
            onDragEnd={onDragEnd}
            onClick={isSelectionMode ? () => onToggleSelect(post.id) : undefined}
            className={containerClasses}
            style={!isGhost ? { animationDelay: `${animationIndex * 50}ms` } : undefined}
            title={isGhost ? "Это будущий циклический пост." : isAutomation ? "Автоматическая публикация" : undefined}
        >
            {isSelectionMode && (
                 <div className="absolute top-2 right-2 w-5 h-5 rounded-sm border border-gray-300 bg-white flex items-center justify-center pointer-events-none z-10">
                    {isSelected && <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                 </div>
            )}
            
            {/* Иконка цикличности (для обычных системных постов) */}
            {isCyclic && !isAutomation && (
                <div className="absolute top-[-8px] right-[-8px] bg-indigo-100 text-indigo-600 rounded-full p-1 border border-indigo-200 shadow-sm z-10" title="Циклическая публикация">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </div>
            )}
            
            {/* Бейдж для автоматизации конкурса */}
            {isContestWinner && (
                <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1 z-10">
                     <div className="bg-fuchsia-100 text-fuchsia-700 rounded-full px-1.5 py-0.5 border border-fuchsia-200 shadow-sm flex items-center gap-1" title="Конкурс отзывов">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
                    </div>
                </div>
            )}

            {/* Бейдж для Универсального конкурса (Старт) */}
            {isGeneralContestStart && (
                <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1 z-10">
                     <div className="bg-sky-100 text-sky-700 rounded-full px-1.5 py-0.5 border border-sky-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Старт">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Конкурс</span>
                    </div>
                </div>
            )}

            {/* Бейдж для Универсального конкурса (Итоги) */}
            {isGeneralContestEnd && (
                <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1 z-10">
                     <div className="bg-orange-100 text-orange-700 rounded-full px-1.5 py-0.5 border border-orange-200 shadow-sm flex items-center gap-1" title="Универсальный конкурс: Итоги">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1 5a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">Итоги</span>
                    </div>
                </div>
            )}

            {/* Бейдж для AI автоматизации */}
            {isAiFeed && (
                <div className="absolute top-[-8px] right-[-4px] flex items-center gap-1 z-10">
                     <div className="bg-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 border border-indigo-200 shadow-sm flex items-center gap-1" title="Автоматическая AI генерация">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider">AI Auto</span>
                    </div>
                </div>
            )}

            <div 
                onClick={!isSelectionMode ? handleClick : undefined}
                className={`flex justify-between items-center mb-1 ${isSelectionMode ? 'opacity-50' : ''} ${isPublished || (isSystemPost && !isAutomation) ? 'pl-7' : ''} ${!isSelectionMode ? 'cursor-pointer' : ''}`}
            >
                <p className={`font-semibold ${
                    isContestWinner ? 'text-fuchsia-800' : 
                    isAiFeed ? 'text-indigo-800' : 
                    isGeneralContestStart ? 'text-sky-800' :
                    isGeneralContestEnd ? 'text-orange-800' :
                    'text-gray-500'
                }`}>{new Date(post.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                
                {/* Скрываем действия для призраков и постов автоматизации */}
                {!isGhost && !isAutomation && (
                    <div ref={actionsContainerRef} className={`flex-grow flex items-center justify-end space-x-1 min-w-0 ${isSelectionMode ? 'pointer-events-none' : ''}`}>
                        <div className="absolute opacity-0 pointer-events-none -z-10 flex">
                            {displayAvailableActions.map(action => (
                                <button key={action.id} data-action-id={action.id} className="p-1 rounded-full">
                                    {action.icon}
                                </button>
                            ))}
                        </div>
                        
                        {displayActions.map(action => (
                             <button
                                key={action.id}
                                onClick={action.onClick}
                                disabled={action.disabled}
                                title={action.label}
                                className="p-1 rounded-full text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {action.icon}
                            </button>
                        ))}

                        <ActionsDropdown actions={displayHiddenActions} />
                    </div>
                )}
            </div>
            
            <div onClick={!isSelectionMode ? handleClick : undefined} className={`${!isSelectionMode ? 'cursor-pointer' : ''} ${isSelectionMode ? 'opacity-50' : ''}`}>
                <ImageGrid images={post.images} />
                <AttachmentsDisplay attachments={post.attachments || []} />
            </div>
            
            {/* Название автоматизации для Универсальных конкурсов */}
            {(isGeneralContestStart || isGeneralContestEnd) && 'title' in post && post.title && (
                 <div 
                    onClick={!isSelectionMode ? handleClick : undefined}
                    className={`mt-1.5 text-[10px] uppercase tracking-wider font-bold truncate cursor-pointer ${isGeneralContestStart ? 'text-sky-700' : 'text-orange-700'}`}
                >
                    {isGeneralContestStart ? 'Конкурс: ' : 'Итоги: '}{post.title}
                </div>
            )}

            <p 
                onClick={!isSelectionMode ? () => isAutomation ? handleClick() : onToggleExpand(post.id) : undefined}
                className={`text-gray-800 break-words ${!isSelectionMode ? 'cursor-pointer' : ''} overflow-hidden transition-[max-height] duration-500 ease-in-out mt-2 ${isExpanded ? 'max-h-96' : 'max-h-5'} ${isSelectionMode ? 'opacity-50' : ''}`}
            >
                {displayText}
            </p>
            
            {showTags && 'tags' in post && <PostTags tags={post.tags} />}

            {isPublished && (
                <>
                    <div 
                        className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 rounded-lg group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" 
                        aria-hidden="true"
                    ></div>
                    <div 
                        className="absolute inset-0 flex items-start justify-start p-2 pointer-events-none group-hover:opacity-0 transition-opacity duration-300" 
                        aria-hidden="true"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </>
            )}
            {/* Статусы для обычных системных постов (не автоматизаций) */}
            {isSystemPost && !isAutomation && (
                <div className="absolute top-2 left-2 pointer-events-none">
                    {systemPostStatus === 'publishing' && onCancelPublicationCheck ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onCancelPublicationCheck(post as SystemPost); }}
                            className="p-1 rounded-full hover:bg-blue-100 transition-colors pointer-events-auto"
                            title="Идет проверка публикации в VK. Нажмите, чтобы отменить проверку и удалить системный пост."
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    ) : (
                         <div title={`Системный пост: ${systemPostStatus}`}>
                            {systemPostStatus === 'pending_publication' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            {systemPostStatus === 'possible_error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                            {systemPostStatus === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});