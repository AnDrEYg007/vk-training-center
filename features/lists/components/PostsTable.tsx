
import React, { useState, useRef, useEffect } from 'react';
import { SystemListPost } from '../../../shared/types';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';

interface PostsTableProps {
    items: SystemListPost[];
    isLoading: boolean;
    onLoadMore?: () => void;
    isFetchingMore?: boolean;
}

export const PostsTable: React.FC<PostsTableProps> = ({ items, isLoading, onLoadMore, isFetchingMore }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
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

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <div className="loader h-8 w-8 mx-auto mb-4 border-t-indigo-500"></div>
                <p>Загрузка постов...</p>
            </div>
        );
    }
    
    if (items.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                Список пуст
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '—';
        return new Date(dateString).toLocaleString('ru-RU', {
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    return (
        <>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar max-h-[70vh] overflow-y-auto">
                <table className="w-full text-sm table-fixed relative">
                    <colgroup>
                        <col className="w-[60px]" /> {/* Медиа */}
                        <col className="w-[250px]" /> {/* Текст (сужен, но читаем) */}
                        <col className="w-[80px]" /> {/* Лайки */}
                        <col className="w-[80px]" /> {/* Комменты */}
                        <col className="w-[80px]" /> {/* Репосты */}
                        <col className="w-[80px]" /> {/* Просмотры */}
                        <col className="w-[140px]" /> {/* Дата публикации */}
                        <col className="w-[140px]" /> {/* Дата сбора */}
                        <col className="w-[60px]" /> {/* Ссылка */}
                    </colgroup>
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Медиа</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Текст</th>
                            
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50" title="Лайки">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50" title="Комментарии">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50" title="Репосты">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50" title="Просмотры">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            </th>
                            
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Публ.</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Собрано</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider bg-gray-50"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2">
                                    {item.image_url ? (
                                        <div className="w-10 h-10 rounded overflow-hidden border border-gray-200 shadow-sm">
                                            <img 
                                                src={item.image_url} 
                                                alt="" 
                                                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                                                onClick={() => setPreviewImage(item.image_url!)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-300 border border-gray-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <div className="text-gray-800 text-sm truncate" title={item.text}>
                                        {item.text || <span className="text-gray-400 italic">Текст отсутствует</span>}
                                    </div>
                                </td>
                                
                                {/* Статистика */}
                                <td className="px-4 py-2">
                                    <span className={`font-medium text-sm ${item.user_likes ? 'text-red-500' : 'text-gray-700'}`}>{item.likes_count}</span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className="text-gray-700 text-sm">{item.comments_count}</span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className="text-gray-700 text-sm">{item.reposts_count}</span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className="text-gray-500 text-sm">{item.views_count}</span>
                                </td>

                                <td className="px-4 py-2 text-gray-600 text-sm whitespace-nowrap">
                                    {formatDate(String(item.date))}
                                </td>
                                <td className="px-4 py-2 text-gray-400 text-sm whitespace-nowrap">
                                    {formatDate(String(item.last_updated))}
                                </td>
                                <td className="px-4 py-2">
                                    <a 
                                        href={item.vk_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-400 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                                        title="Открыть пост в VK"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </td>
                            </tr>
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
