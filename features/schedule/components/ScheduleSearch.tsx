import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UnifiedPost } from '../hooks/useScheduleData';

interface ScheduleSearchProps {
    posts: UnifiedPost[];
    onSelectPost: (post: UnifiedPost) => void;
}

export const ScheduleSearch: React.FC<ScheduleSearchProps> = ({ posts, onSelectPost }) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter posts logic
    const filteredPosts = useMemo(() => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        
        // Filter and sort by date descending (newest first)
        return posts
            .filter(post => post.text && post.text.toLowerCase().includes(lowerQuery))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [posts, query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectPost = (post: UnifiedPost) => {
        setIsOpen(false);
        onSelectPost(post);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleString('ru-RU', { 
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
            });
        } catch (e) {
            return dateStr;
        }
    };

    const getVkLink = (post: UnifiedPost) => {
        if (post.vkPostUrl) return post.vkPostUrl;
        
        if (post.postType === 'published' && post.id && post.project_id) {
             // Try to construct VK link if ID looks like owner_id_post_id
             // However, internal ID might be UUID. 
             // If published, usually we don't have the VK ID unless we store it.
             // Looking at types, ScheduledPost has vkPostUrl.
             return null;
        }
        return null;
    };

    return (
        <div className="relative ml-2" ref={containerRef}>
            <div className="relative flex items-center">
                 <input 
                    type="text" 
                    placeholder="Поиск по тексту..." 
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-40 sm:w-64 transition-all"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                 />
                 <div className="absolute left-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
            </div>

            {isOpen && query && (
                <div className="absolute top-full left-0 z-50 mt-1 w-full sm:w-80 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {filteredPosts.length > 0 ? (
                        <ul className="py-1">
                            {filteredPosts.map(post => (
                                <li key={post.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 p-3 cursor-pointer group transition-colors" onClick={() => handleSelectPost(post)}>
                                     <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide ${
                                            post.postType === 'published' ? 'bg-green-100 text-green-800' :
                                            post.postType === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            'bg-purple-100 text-purple-800'
                                        }`}>
                                            {post.postType === 'published' ? 'Опубликован' : 
                                             post.postType === 'scheduled' ? 'Отложен' : 'Системный'}
                                        </span>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(post.date)}</span>
                                     </div>
                                     
                                     <div className="text-sm text-gray-700 line-clamp-2 mb-2 break-words leading-snug">
                                        {post.text}
                                     </div>
                                     
                                     <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                                        <div className="flex -space-x-2 overflow-hidden items-center h-6">
                                            {post.images && post.images.length > 0 && post.images.slice(0, 3).map((img, idx) => (
                                                 <img key={idx} src={img.url} alt="" className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" />
                                            ))}
                                            {post.images && post.images.length > 3 && (
                                                <span className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 text-[10px] font-medium text-gray-600">
                                                    +{post.images.length - 3}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* External Link */}
                                        {(post.vkPostUrl) && (
                                             <a 
                                                href={post.vkPostUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline p-1 -mr-1 rounded hover:bg-indigo-50 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                                title="Открыть в ВКонтакте"
                                             >
                                                <span>ВК</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                             </a>
                                        )}
                                     </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm">Посты не найдены</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
