
import React, { useState, useRef, useEffect } from 'react';
import { SystemListInteraction } from '../../../shared/types';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';

interface InteractionTableProps {
    items: SystemListInteraction[];
    isLoading: boolean;
    projectId: string;
    vkGroupId: string; // ID группы для формирования ссылок
    listType: 'likes' | 'comments' | 'reposts';
    onLoadMore?: () => void;
    isFetchingMore?: boolean;
}

export const InteractionTable: React.FC<InteractionTableProps> = ({ items, isLoading, projectId, vkGroupId, listType, onLoadMore, isFetchingMore }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!onLoadMore) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [onLoadMore]);

    const toggleExpand = (id: string) => {
        setExpandedRowId(prev => prev === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="loader h-8 w-8 mx-auto mb-4 border-t-indigo-500"></div>
                <p>Загрузка данных...</p>
            </div>
        );
    }
    
    if (items.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Список пуст. Запустите сбор данных за период.
            </div>
        );
    }

    const formatLastSeen = (lastSeen: number | null | undefined) => {
        if (!lastSeen) return '—';
        return new Date(lastSeen * 1000).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
    };
    
    const formatSex = (sex: number | null | undefined) => {
        if (sex === 1) return 'Жен.';
        if (sex === 2) return 'Муж.';
        return '—';
    };

    const formatInteractionDate = (dateString: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getPlatformBadge = (platform: number | undefined | null) => {
        if (!platform) return null;
        // 1 - m.vk, 2 - iPhone, 3 - iPad, 4 - Android, 5 - WP, 6 - Win10, 7 - Web
        
        const badgeBase = "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ml-2";
        
        switch (platform) {
            case 1: // Mobile Web
                return <span className={`${badgeBase} bg-orange-50 text-orange-700 border-orange-100`}>m.vk</span>;
            case 2: // iPhone
            case 3: // iPad
                return <span className={`${badgeBase} bg-slate-100 text-slate-700 border-slate-200`}>iOS</span>;
            case 4: // Android
                return <span className={`${badgeBase} bg-emerald-50 text-emerald-700 border-emerald-100`}>Android</span>;
            case 6: // Windows App
            case 7: // Desktop Web
                return <span className={`${badgeBase} bg-blue-50 text-blue-700 border-blue-100`}>Web</span>;
            default:
                return <span className={`${badgeBase} bg-gray-50 text-gray-600 border-gray-200`}>Mob</span>;
        }
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[70vh] overflow-y-auto">
                <table className="w-full text-sm relative">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="w-10 px-4 py-3 bg-gray-50"></th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider w-16 bg-gray-50"></th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Пользователь</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Пол</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">ДР</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Город</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Онлайн / Платформа</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Статус</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Всего</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Посл. актив</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <React.Fragment key={item.id}>
                                <tr 
                                    className={`transition-colors cursor-pointer ${expandedRowId === item.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => toggleExpand(item.id)}
                                >
                                    <td className="px-4 py-2 text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedRowId === item.id ? 'rotate-90 text-indigo-600' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.photo_url ? (
                                            <img 
                                                src={item.photo_url} 
                                                alt="" 
                                                className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity shadow-sm" 
                                                onClick={(e) => { e.stopPropagation(); setPreviewImage(item.photo_url!); }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <a 
                                            href={`https://vk.com/id${item.vk_user_id}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="font-medium text-indigo-600 hover:text-indigo-800 block text-base"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {item.first_name} {item.last_name}
                                        </a>
                                        <div className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                                            <span>id: {item.vk_user_id}</span>
                                            {item.domain && item.domain !== `id${item.vk_user_id}` && <span>(@{item.domain})</span>}
                                             {item.has_mobile && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <title>Известен номер телефона</title>
                                                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 text-sm">
                                        {formatSex(item.sex)}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 text-sm whitespace-nowrap">
                                        {item.bdate || '—'}
                                    </td>
                                     <td className="px-4 py-2 text-gray-600 text-sm">
                                        {item.city || '—'}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 text-xs">
                                        <div className="flex items-center">
                                            <span className="whitespace-nowrap">{formatLastSeen(item.last_seen)}</span>
                                            {getPlatformBadge(item.platform)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {item.deactivated ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800" title={item.deactivated}>
                                                {item.deactivated === 'banned' ? 'Заблокирован' : 'Удален'}
                                            </span>
                                        ) : item.is_closed ? (
                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                Закрытый
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Активен
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-bold bg-white border border-gray-300 text-gray-700 shadow-sm">
                                            {item.interaction_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-800 text-sm">
                                        {formatInteractionDate(String(item.last_interaction_date))}
                                    </td>
                                </tr>
                                {expandedRowId === item.id && (
                                    <tr className="bg-gray-50/50">
                                        <td colSpan={10} className="px-8 py-4 border-b border-gray-200">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">История активности ({item.post_ids?.length || 0})</p>
                                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                                {item.post_ids && item.post_ids.map(postId => (
                                                    <a 
                                                        key={postId}
                                                        href={`https://vk.com/wall-${vkGroupId}_${postId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-2 py-1 text-xs rounded border border-gray-300 bg-white text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                                                        title="Открыть пост в VK"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Post #{postId}
                                                    </a>
                                                ))}
                                                 {(!item.post_ids || item.post_ids.length === 0) && <span className="text-sm text-gray-400 italic">Нет данных о постах</span>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                 {onLoadMore && (
                    <div ref={observerTarget} className="h-8 w-full flex justify-center items-center py-2">
                        {isFetchingMore && (
                            <div className="loader h-6 w-6 border-t-indigo-500"></div>
                        )}
                    </div>
                )}
            </div>
            
            {previewImage && (
                <ImagePreviewModal 
                    image={{ id: 'preview', url: previewImage }} 
                    onClose={() => setPreviewImage(null)} 
                />
            )}
        </>
    );
};
