import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PublishedPost } from '../types';
import { ImagePreviewModal } from '../../../../shared/components/modals/ImagePreviewModal';

interface StoriesSettingsViewProps {
    isActive: boolean;
    setIsActive: (val: boolean) => void;
    keywords: string;
    setKeywords: (val: string) => void;
    posts: PublishedPost[];
    visibleCount: number;
    setVisibleCount: React.Dispatch<React.SetStateAction<number>>; // Or better: just pass the value if pagination logic is inside hook
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    handleScroll: () => void;
    isSaving: boolean;
    getPostStatus: (post: PublishedPost) => any;
    getFirstImage: (post: PublishedPost) => string | null;
    handleManualPublish: (post: PublishedPost) => void;
    isPublishing: number | null;
}

// Компонент для предпросмотра изображения при наведении (дублируется из StoriesStatsView для изоляции)
const HoverPreview: React.FC<{ url: string; rect: DOMRect; isExiting: boolean }> = ({ url, rect, isExiting }) => {
    const scale = 2.5; 
    const newWidth = rect.width * scale;
    const newHeight = rect.height * scale;
    
    let top = rect.top + (rect.height - newHeight) / 2;
    let left = rect.left + (rect.width - newWidth) / 2;
    
    const margin = 16;
    if (top < margin) top = margin;
    if (left < margin) left = margin;
    if (top + newHeight > window.innerHeight - margin) top = window.innerHeight - newHeight - margin;
    if (left + newWidth > window.innerWidth - margin) left = window.innerWidth - newWidth - margin;

    const animationClass = isExiting ? 'animate-image-preview-out' : 'animate-image-preview-in';

    return createPortal(
        <div
            style={{
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: `${newWidth}px`,
                height: `${newHeight}px`,
                zIndex: 150,
                pointerEvents: 'none',
            }}
            className={`shadow-2xl rounded-lg ${animationClass}`}
        >
            <img src={url} className="w-full h-full object-cover rounded-lg border-2 border-white" alt="Hover preview" />
        </div>,
        document.body
    );
};

export const StoriesSettingsView: React.FC<StoriesSettingsViewProps> = ({
    isActive, setIsActive,
    keywords, setKeywords,
    posts, visibleCount,
    scrollContainerRef, handleScroll,
    getPostStatus, getFirstImage,
    handleManualPublish, isPublishing
}) => {
    
    // Sort posts
    const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));
    const paginatedPosts = sortedPosts.slice(0, visibleCount);

    // Состояния для превью изображений
    const [hoveredImage, setHoveredImage] = useState<{ url: string; rect: DOMRect } | null>(null);
    const [isExitingPreview, setIsExitingPreview] = useState(false);
    const exitTimeoutRef = useRef<number | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null); // URL для модального окна

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

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-shrink-0 sticky top-0 z-30">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-base font-semibold text-gray-900">Настройки фильтрации</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="max-w-2xl">
                            <label className="text-sm font-medium text-gray-900 mb-1 block">Статус автоматизации</label>
                            <p className="text-sm text-gray-500">
                                Когда включено, система каждые 10 минут проверяет новые посты. Если пост содержит одно из ключевых слов, он будет автоматически опубликован в истории.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>

                    {isActive && (
                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 space-y-3 fade-in">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Режим отбора постов
                                </label>
                                <div className="flex space-x-4 mb-3">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="filterMode" 
                                            className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300"
                                            checked={keywords !== '*'}
                                            onChange={() => setKeywords('')}
                                        />
                                        <span className="ml-2 text-sm text-gray-900">По ключевым словам</span>
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="filterMode" 
                                            className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300"
                                            checked={keywords === '*'}
                                            onChange={() => setKeywords('*')}
                                        />
                                        <span className="ml-2 text-sm text-gray-900">Все посты подряд</span>
                                    </label>
                                </div>

                                {keywords !== '*' ? (
                                    <>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Введите ключевые слова
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                            </div>
                                            <input 
                                                type="text" 
                                                value={keywords} 
                                                onChange={(e) => setKeywords(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Например: #вистории, #repost, #важное"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Регистр не важен. Разделяйте слова запятой.
                                        </p>
                                    </>
                                ) : (
                                    <div className="p-3 bg-blue-100/50 text-blue-800 text-sm rounded-lg border border-blue-200 flex gap-2">
                                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p>
                                            В этом режиме <strong>абсолютно все</strong> новые посты, появляющиеся в ленте, будут автоматически дублироваться в истории. Фильтрация по словам отключена.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-base font-semibold text-gray-900">История обработки <span className="text-gray-400 font-normal ml-1">{posts.length} постов</span></h3>
                    <div className="text-xs text-gray-500">
                        Показано {Math.min(visibleCount, posts.length)} из {posts.length}
                    </div>
                </div>
                
                {sortedPosts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                        <p className="font-medium">Список постов пуст</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white custom-scrollbar">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left w-20">Превью</th>
                                    <th scope="col" className="px-6 py-3 text-left">Содержание</th>
                                    <th scope="col" className="px-6 py-3 text-left w-48">Дата</th>
                                    <th scope="col" className="px-6 py-3 text-left w-64">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedPosts.map((post, index) => {
                                    const info = getPostStatus(post);
                                    const imageUrl = getFirstImage(post);
                                    const postDate = new Date(post.date);

                                    return (
                                        <tr 
                                            key={post.id} 
                                            className="hover:bg-gray-50/80 transition-colors opacity-0 animate-fade-in-up"
                                            style={{ animationDelay: `${index * 30}ms` }}
                                        >
                                            <td className="px-6 py-4 align-top">
                                                {imageUrl ? (
                                                    <div 
                                                        className="w-12 h-12 rounded-lg cursor-pointer relative"
                                                        onMouseEnter={(e) => handleMouseEnter(e, imageUrl)}
                                                        onMouseLeave={handleMouseLeave}
                                                        onClick={() => setPreviewImage(imageUrl)}
                                                    >
                                                        <img src={imageUrl} alt="" className="w-full h-full rounded-lg object-cover border" loading="lazy" />
                                                    </div>
                                                ) : <div className="w-12 h-12 bg-gray-50 rounded-lg border text-[10px] flex items-center justify-center">NO IMG</div>}
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="text-sm line-clamp-3 text-gray-900">{post.text}</div>
                                            </td>
                                            <td className="px-6 py-4 align-top text-sm text-gray-500">
                                                <div>{postDate.toLocaleDateString()}</div>
                                                <div className="text-xs">{postDate.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                                                <a href={post.vkPostUrl} target="_blank" className="text-xs text-indigo-600 mt-1 block">ВКонтакте</a>
                                            </td>
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className={`px-2 py-0.5 text-xs rounded-full border ${info.color}`}>{info.label}</span>
                                                    {info.storyLink && <a href={info.storyLink} target="_blank" className="text-xs text-blue-600">История</a>}
                                                    <button 
                                                        onClick={() => handleManualPublish(post)}
                                                        disabled={isPublishing === post.id}
                                                        className={`mt-2 px-2 py-1 text-xs rounded text-white ${isPublishing === post.id ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                    >
                                                        {isPublishing === post.id ? '...' : 'Опубликовать'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Hover Preview Portal */}
            {hoveredImage && <HoverPreview url={hoveredImage.url} rect={hoveredImage.rect} isExiting={isExitingPreview} />}
            
            {/* Fullscreen Modal */}
            {previewImage && (
                <ImagePreviewModal
                    image={{ url: previewImage, id: 'preview', type: 'photo' }}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </>
    );
};
