
import React from 'react';
import { MarketAlbum } from '../../../shared/types';

interface AlbumFiltersProps {
    albums: MarketAlbum[];
    itemsCount: number;
    itemsWithoutAlbumCount: number; // Новый проп
    isLoading: boolean;
    activeAlbumId: string;
    onSelectAlbum: (albumId: string) => void;
    // Новые пропсы для создания подборки
    isCreatingAlbum: boolean;
    setIsCreatingAlbum: (isCreating: boolean) => void;
    newAlbumTitle: string;
    setNewAlbumTitle: (title: string) => void;
    handleCreateAlbum: () => void;
}

const Skeleton: React.FC = () => (
    <div className="flex items-center gap-2 flex-wrap animate-pulse">
        <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-40 bg-gray-200 rounded-md"></div>
        <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
    </div>
);

export const AlbumFilters: React.FC<AlbumFiltersProps> = ({
    albums, itemsCount, itemsWithoutAlbumCount, isLoading, activeAlbumId, onSelectAlbum,
    isCreatingAlbum, setIsCreatingAlbum, newAlbumTitle, setNewAlbumTitle, handleCreateAlbum
}) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            {isLoading ? (
                <Skeleton />
            ) : (
                <div className="flex items-center gap-2 flex-wrap">
                    <button 
                        onClick={() => onSelectAlbum('all')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border whitespace-nowrap ${activeAlbumId === 'all' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        Все - {itemsCount}
                    </button>
                    
                    {/* Кнопка "Без подборки" отображается только если такие товары есть */}
                    {itemsWithoutAlbumCount > 0 && (
                        <button 
                            onClick={() => onSelectAlbum('none')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border whitespace-nowrap ${activeAlbumId === 'none' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Без подборки - {itemsWithoutAlbumCount}
                        </button>
                    )}
                    
                    {albums.map(album => {
                        const isActive = String(album.id) === activeAlbumId;
                        const wrapperClass = `inline-flex items-center text-sm font-medium rounded-md transition-colors border ${
                            isActive 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`;

                        return (
                            <div key={album.id} className={wrapperClass}>
                                <button
                                    onClick={() => onSelectAlbum(String(album.id))}
                                    className="px-3 py-1.5 focus:outline-none rounded-l-md whitespace-nowrap"
                                >
                                    {album.title} - {album.count}
                                </button>
                                <div className={`w-px h-4 ${isActive ? 'bg-indigo-400' : 'bg-gray-300'}`}></div>
                                <a
                                    href={`https://vk.com/market${album.owner_id}?section=album_${album.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-1.5 rounded-r-md hover:opacity-75 focus:outline-none flex items-center"
                                    title="Перейти в подборку VK"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        );
                    })}

                    {isCreatingAlbum ? (
                        <div className="flex items-center gap-2 animate-fade-in-up">
                            <input
                                type="text"
                                placeholder="Название новой подборки..."
                                value={newAlbumTitle}
                                onChange={(e) => setNewAlbumTitle(e.target.value)}
                                className="border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateAlbum()}
                            />
                            <button onClick={handleCreateAlbum} className="px-3 py-1.5 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 whitespace-nowrap">Ок</button>
                            <button onClick={() => setIsCreatingAlbum(false)} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" title="Отмена">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ) : (
                         <button
                            type="button"
                            onClick={() => setIsCreatingAlbum(true)}
                            title="Создать новую подборку"
                            className="px-3 py-1.5 text-sm font-medium border-2 border-dashed rounded-md transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50 whitespace-nowrap"
                        >
                            + Создать подборку
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};