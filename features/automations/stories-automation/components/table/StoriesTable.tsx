import React, { useRef, useState, useEffect } from 'react';
import { UnifiedStory } from '../../types';
import { ImagePreviewModal } from '../../../../../shared/components/modals/ImagePreviewModal';
import { HoverPreview } from '../shared/HoverPreview';

interface StoriesTableProps {
    stories: UnifiedStory[];
    isLoading: boolean;
    updatingStatsId: string | null;
    onUpdateStats: (mode: 'single', params: { logId: string | null; vkStoryId: number }) => void;
    onLoadStories: () => void;
    onBatchUpdate: (mode: 'last_n' | 'period', params: any) => void;
}

const StatItem = ({ label, data, color = 'blue', fullLabel }: { label: string, data: { state?: string, count: number } | undefined, color?: string, fullLabel?: string }) => {
    if (!data) return (
        <div className="flex flex-col items-center bg-gray-50 p-1.5 rounded border border-gray-100 min-w-[50px] h-full justify-center">
            <span className="text-[10px] text-gray-400 uppercase font-medium truncate w-full text-center" title={fullLabel || label}>{label}</span>
            <span className="text-sm font-semibold text-gray-300">-</span>
        </div>
    );
    
    // State can be 'on' 'off' 'hidden'. If state is missing but count exists, assume valid.
    const isOff = data.state && data.state !== 'on';
    
    return (
        <div className={`flex flex-col items-center p-1.5 rounded border min-w-[50px] h-full justify-center transition-colors ${isOff ? 'bg-gray-50 border-gray-200 opacity-60' : `bg-${color}-50 border-${color}-100 hover:bg-${color}-100`}`}>
            <span className={`text-[10px] uppercase font-bold truncate w-full text-center ${isOff ? 'text-gray-400' : `text-${color}-600`}`} title={fullLabel || label}>{label}</span>
            <span className={`text-sm font-bold ${isOff ? 'text-gray-400' : `text-${color}-800`}`}>{data.count}</span>
        </div>
    );
};

export const StoriesTable: React.FC<StoriesTableProps> = ({ 
    stories, isLoading, updatingStatsId, onUpdateStats, onLoadStories, onBatchUpdate
}) => {
    const [isRefreshDropdownOpen, setIsRefreshDropdownOpen] = useState(false);
    const refreshDropdownRef = useRef<HTMLDivElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    // Состояния для превью изображений
    const [hoveredImage, setHoveredImage] = useState<{ url: string; rect: DOMRect } | null>(null);
    const [isExitingPreview, setIsExitingPreview] = useState(false);
    const exitTimeoutRef = useRef<number | null>(null);

    // Обработчик наведения мыши
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        if (exitTimeoutRef.current) {
            clearTimeout(exitTimeoutRef.current);
            exitTimeoutRef.current = null;
        }
        setIsExitingPreview(false);
        setHoveredImage({ url, rect });
    };

    // Обработчик ухода мыши
    const handleMouseLeave = () => {
        setIsExitingPreview(true);
        exitTimeoutRef.current = window.setTimeout(() => {
            setHoveredImage(null);
            setIsExitingPreview(false);
        }, 200);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (refreshDropdownRef.current && !refreshDropdownRef.current.contains(event.target as Node)) {
                setIsRefreshDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
             {/* Header / Toolbar */}
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        История публикаций
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Отображаются все истории: активные (из VK) и архивированные (из базы).
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                <div className="relative flex items-center" ref={refreshDropdownRef}>
                    <button 
                        onClick={() => setIsRefreshDropdownOpen(prev => !prev)} 
                        disabled={updatingStatsId !== null} 
                        className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
                    >
                            <svg className={`w-3.5 h-3.5 mr-2 ${updatingStatsId !== null ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        <span>Обновить статистику</span>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isRefreshDropdownOpen ? 'max-w-[800px] opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                        <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-lg shadow-sm whitespace-nowrap">
                            
                            <span className="px-2 text-[10px] font-bold text-gray-400 uppercase">Посл:</span>
                            {[10, 30, 50, 100].map(n => (
                                <button key={n} onClick={() => { onBatchUpdate('last_n', {count: n}); setIsRefreshDropdownOpen(false); }} className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded hover:text-indigo-600 transition-colors font-medium">
                                    {n}
                                </button>
                            ))}

                            <div className="h-4 w-px bg-gray-200 mx-1"></div>
                            
                            <span className="px-2 text-[10px] font-bold text-gray-400 uppercase">Дни:</span>
                            {[7, 30, 90].map(d => (
                                <button key={d} onClick={() => { onBatchUpdate('period', {days: d}); setIsRefreshDropdownOpen(false); }} className="px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded hover:text-indigo-600 transition-colors font-medium">
                                    {d}
                                </button>
                            ))}

                            <div className="h-4 w-px bg-gray-200 mx-1"></div>
                                <button onClick={() => { onBatchUpdate('period', {days: 3650}); setIsRefreshDropdownOpen(false); }} className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded font-medium">
                                Все
                            </button>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onLoadStories}
                    disabled={isLoading}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    )}
                    Обновить список
                </button>
            </div>
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        ) : stories.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500 p-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-gray-900 font-medium">Нет данных об историях</p>
                <p className="text-sm text-gray-500 mt-1">Опубликуйте первую историю или включите автоматизацию.</p>
            </div>
        ) : (
            <div className="overflow-x-auto bg-white custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Превью</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Информация</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статистика</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {stories.map((story, index) => {
                            const stats = story.detailed_stats;
                            const isUpdating = updatingStatsId !== null && (updatingStatsId === story.log_id || updatingStatsId === `vk_${story.vk_story_id}`);
                            // Ensure unique key by combining id and index
                            const uniqueKey = `${story.vk_story_id}-${index}`;

                            return (
                                <tr 
                                    key={uniqueKey} 
                                    className={`hover:bg-gray-50 transition-colors ${story.is_active ? 'bg-white' : 'bg-gray-50/30'} opacity-0 animate-fade-in-up`}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <td className="px-6 py-4 align-top">
                                        {story.preview ? (
                                            <div 
                                                className="block w-12 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:ring-2 ring-indigo-500 transition-all cursor-pointer relative"
                                                onMouseEnter={(e) => handleMouseEnter(e, story.preview!)}
                                                onMouseLeave={handleMouseLeave}
                                                onClick={() => setPreviewImage(story.preview || null)}
                                            >
                                                <img src={story.preview} className="w-full h-full object-cover" alt="Story" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-20 bg-gray-100 rounded-lg border flex items-center justify-center text-[9px] text-gray-400 text-center p-1">
                                                Нет фото
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td className="px-6 py-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {/* Date & Type */}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(story.date * 1000).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">{story.type}</div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {story.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                                                        Активна
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                                                        Архив
                                                    </span>
                                                )}

                                                {story.is_automated ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                        Наш сервис
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                                        Вручную
                                                    </span>
                                                )}
                                            </div>
                                            
                                            {/* Automation Link info */}
                                            {story.is_automated && story.vk_post_id && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Пост ID: <span className="font-mono bg-gray-100 px-1 rounded">{story.vk_post_id}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 align-top">
                                        {/* Detailed Stats Grid - Adaptive */}
                                        {stats ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-8 gap-2 w-full max-w-full">
                                                {/* Stat Item - Responsive Grid Cell */}
                                                <div className="col-span-1">
                                                    <StatItem label="Просм." data={stats.views || {state: 'on', count: story.views}} color="indigo" fullLabel="Просмотры" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="Лайки" data={stats.likes} color="pink" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="Ответы" data={stats.replies} color="blue" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="Клики" data={stats.open_link || stats.link_clicks} color="green" />
                                                </div>
                                                
                                                <div className="col-span-1">
                                                    <StatItem label="Репосты" data={stats.shares} color="purple" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="Подп." data={stats.subscribers} color="amber" fullLabel="Подписчики" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="Скрытия" data={stats.bans} color="red" />
                                                </div>
                                                <div className="col-span-1">
                                                    <StatItem label="ЛС" data={stats.answer} color="cyan" fullLabel="Ответы в ЛС" />
                                                </div>
                                                
                                                {story.stats_updated_at && (
                                                    <div className="col-span-full text-[10px] text-gray-400 text-right mt-1">
                                                        Обновлено: {new Date(story.stats_updated_at).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-start gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-gray-900">{story.views}</span>
                                                    <span className="text-xs text-gray-500 uppercase font-medium">Просмотров</span>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-xs text-gray-500 max-w-[200px]">
                                                    Детальная статистика отсутствует. Нажмите "Обновить" для загрузки.
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 align-top text-right space-y-2">
                                        {story.link && (
                                            <a 
                                                href={story.link} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors w-full justify-end"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                Ссылка
                                            </a>
                                        )}
                                        
                                        {/* Update Button */}
                                        {
                                            <button 
                                                onClick={() => onUpdateStats('single', { logId: story.log_id, vkStoryId: story.vk_story_id })}
                                                disabled={isUpdating || updatingStatsId !== null}
                                                className={`w-full px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                                                    isUpdating 
                                                        ? 'bg-gray-100 text-gray-400 border-transparent cursor-wait'
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 shadow-sm'
                                                }`}
                                            >
                                                {isUpdating ? 'Обновление...' : 'Обновить'}
                                            </button>
                                        }
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )}
        
        {/* Hover Preview Portal */}
        {hoveredImage && <HoverPreview url={hoveredImage.url} rect={hoveredImage.rect} isExiting={isExitingPreview} />}
        
        {/* Fullscreen Modal */}
        {previewImage && (
            <ImagePreviewModal
                image={{ url: previewImage, id: 'preview', type: 'photo' }}
                onClose={() => setPreviewImage(null)}
            />
        )}
    </div>
    );
};
