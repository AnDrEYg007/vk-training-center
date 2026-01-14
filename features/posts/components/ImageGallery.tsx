import React, { useState, useEffect, useCallback, useRef, DragEvent, useMemo } from 'react';
import { Album, Photo } from '../../../shared/types';
import * as api from '../../../services/api';
import { LazyImage } from '../../../shared/components/LazyImage';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';
import { CreateAlbumModal } from './modals/CreateAlbumModal';
import { UploadConfirmationModal } from './modals/UploadConfirmationModal';
import { v4 as uuidv4 } from 'uuid';

interface ImageGalleryProps {
    projectId: string;
    onAddImages: (photos: Photo[]) => void;
}

// === НОВЫЕ ТИПЫ И КОМПОНЕНТЫ ДЛЯ ЗАГРУЗКИ ===

type UploadStatus = 'uploading' | 'completed' | 'failed';

interface UploadingPhoto {
  tempId: string;
  file: File;
  status: UploadStatus;
  error?: string;
}

const UploadingPhotoGridItem: React.FC<{ item: UploadingPhoto }> = ({ item }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(item.file);
    }, [item.file]);

    return (
        <div className="relative aspect-square group animate-fade-in-up">
            {previewUrl && <img src={previewUrl} className="w-full h-full object-cover rounded opacity-50" alt="uploading preview"/>}
            <div className={`absolute inset-0 rounded flex items-center justify-center text-white ${item.status === 'failed' ? 'bg-red-800/80' : 'bg-black/50'}`}>
                {item.status === 'failed' ? (
                    <div className="text-center p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs break-all" title={item.error}>{item.error && item.error.length > 20 ? 'Ошибка' : item.error}</p>
                    </div>
                ) : (
                    <div className="loader border-white border-t-transparent"></div>
                )}
            </div>
        </div>
    );
};

// ===============================================

const getGridColsClass = (size: number) => {
    switch (size) {
        case 4: return 'grid-cols-4';
        case 5: return 'grid-cols-5';
        default: return 'grid-cols-3';
    }
};

const GallerySkeleton: React.FC<{ gridSize: number }> = ({ gridSize }) => (
    <div className={`grid ${getGridColsClass(gridSize)} gap-3 animate-pulse`}>
        {Array.from({ length: gridSize * 3 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-md"></div>
        ))}
    </div>
);

const AlbumSkeleton: React.FC = () => (
     <div className="flex flex-wrap items-center gap-2 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full"></div>
        ))}
    </div>
);


export const ImageGallery: React.FC<ImageGalleryProps> = ({ projectId, onAddImages }) => {
    const [tab, setTab] = useState<'project' | 'agency'>('project');
    
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [isLoadingAlbums, setIsLoadingAlbums] = useState(false);
    const [albumError, setAlbumError] = useState<string | null>(null);
    const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [uploadingPhotos, setUploadingPhotos] = useState<UploadingPhoto[]>([]);
    
    const [selection, setSelection] = useState<Photo[]>([]);
    const [previewImage, setPreviewImage] = useState<Photo | null>(null);
    const [gridSize, setGridSize] = useState(3);
    
    // Drag & Drop State
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [filesToConfirm, setFilesToConfirm] = useState<File[]>([]);
    const dragCounter = useRef(0);
    
    const loadMoreRef = useRef(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const selectedAlbum = useMemo(() => albums.find(a => a.id === selectedAlbumId), [albums, selectedAlbumId]);

    const fetchAlbums = useCallback(async (isRefresh = false) => {
        if (tab === 'agency') {
            setAlbums([]);
            setSelectedAlbumId(null);
            setAlbumError("Галерея агентства пока не реализована.");
            return;
        }
        setIsLoadingAlbums(true);
        setAlbumError(null);
        try {
            const apiCall = isRefresh ? api.refreshAlbums : api.getAlbums;
            const newAlbums = await apiCall(projectId);
            setAlbums(newAlbums);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Не удалось загрузить альбомы.";
            setAlbumError(msg);
        } finally {
            setIsLoadingAlbums(false);
        }
    }, [projectId, tab]);

    useEffect(() => {
        fetchAlbums(false);
    }, [fetchAlbums]);

    const fetchPhotos = useCallback(async (albumId: string, forPage: number, isRefresh = false) => {
        if (!albumId) return;
        
        setIsLoadingPhotos(true);
        setPhotoError(null);
        try {
            const apiCall = isRefresh ? api.refreshPhotos : api.getPhotos;
            const { photos: newPhotos, hasMore: newHasMore } = await apiCall(projectId, albumId, forPage);
            
            setPhotos(prev => forPage === 1 ? newPhotos : [...prev, ...newPhotos]);
            setHasMore(newHasMore);
            setPage(forPage);

        } catch (err) {
            const msg = err instanceof Error ? err.message : "Не удалось загрузить фотографии.";
            setPhotoError(msg);
        } finally {
            setIsLoadingPhotos(false);
        }
    }, [projectId]);

    const handleLoadMore = useCallback(() => {
        if (selectedAlbumId && !isLoadingPhotos && hasMore) {
            fetchPhotos(selectedAlbumId, page + 1);
        }
    }, [selectedAlbumId, isLoadingPhotos, hasMore, page, fetchPhotos]);
    
     useEffect(() => {
        if (isLoadingPhotos || !hasMore) return;
        const observer = new IntersectionObserver(entries => { if (entries[0].isIntersecting) handleLoadMore(); }, { threshold: 1.0 });
        const currentRef = loadMoreRef.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, [handleLoadMore, hasMore, isLoadingPhotos]);

    const handleSelectAlbum = (albumId: string) => {
        setSelectedAlbumId(albumId);
        setPhotos([]);
        setPage(1);
        setHasMore(true);
        fetchPhotos(albumId, 1, false);
    };
    
     const handleBackToAlbums = () => {
        setSelectedAlbumId(null);
        setPhotos([]);
        setSelection([]);
    };
    
    const handleRefreshPhotos = useCallback((albumId: string) => {
         if (!isLoadingPhotos) {
            setPhotos([]);
            fetchPhotos(albumId, 1, true);
        }
    }, [isLoadingPhotos, fetchPhotos]);

    const handleImageSelect = (photo: Photo) => {
        setSelection(prev => 
            prev.some(p => p.id === photo.id)
                ? prev.filter(p => p.id !== photo.id)
                : [...prev, photo]
        );
    };

    const uploadFilesToAlbum = useCallback(async (files: File[]) => {
        if (!selectedAlbumId) return;
    
        const newUploads: UploadingPhoto[] = files.map(file => ({
            tempId: uuidv4(),
            file,
            status: 'uploading',
        }));
    
        setUploadingPhotos(prev => [...newUploads, ...prev]);
    
        const uploadPromises = newUploads.map(upload => 
            api.uploadPhotoToAlbum(upload.file, projectId, selectedAlbumId)
                .then(() => {
                    setUploadingPhotos(prev => prev.filter(u => u.tempId !== upload.tempId));
                })
                .catch(error => {
                    const errorMessage = error instanceof Error ? error.message : 'Ошибка';
                    setUploadingPhotos(prev => prev.map(u => u.tempId === upload.tempId ? { ...u, status: 'failed', error: errorMessage } : u));
                    setTimeout(() => {
                        setUploadingPhotos(prev => prev.filter(u => u.tempId !== upload.tempId));
                    }, 5000);
                })
        );
    
        await Promise.allSettled(uploadPromises);
        // Сначала обновляем список альбомов, чтобы получить актуальный `size`
        await fetchAlbums(true);
        // Затем обновляем фотографии в текущем альбоме, чтобы увидеть новые
        handleRefreshPhotos(selectedAlbumId);
    }, [projectId, selectedAlbumId, fetchAlbums, handleRefreshPhotos]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            uploadFilesToAlbum(files);
        }
        if (event.target) event.target.value = '';
    };

    // --- Drag & Drop Handlers ---
    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (selectedAlbumId && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDraggingOver(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDraggingOver(false);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current = 0;
        if (!selectedAlbumId) return;
        setIsDraggingOver(false);
        // FIX: Explicitly type 'file' as File to access its 'type' property.
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
        if (droppedFiles.length > 0) {
            setFilesToConfirm(droppedFiles);
        }
    };
    
    const handleConfirmUpload = () => {
        uploadFilesToAlbum(filesToConfirm);
        setFilesToConfirm([]);
    };


    const renderPhotoContent = () => {
        if (isLoadingPhotos && photos.length === 0 && uploadingPhotos.length === 0) return <GallerySkeleton gridSize={gridSize} />;
        if (photoError) return <div className="text-red-600 text-center py-4">{photoError}</div>;
        if (photos.length === 0 && !isLoadingPhotos && uploadingPhotos.length === 0) {
             return (
                <div className="text-center text-gray-500 py-4">
                    В этом альбоме нет фотографий.
                    <br/>
                    Перетащите файлы сюда или используйте кнопки для загрузки.
                </div>
             );
        }

        return (
            <>
                <div className={`grid ${getGridColsClass(gridSize)} gap-3`}>
                    {uploadingPhotos.map(item => <UploadingPhotoGridItem key={item.tempId} item={item} />)}
                    {photos.map((photo, idx) => {
                        const isSelected = selection.some(p => p.id === photo.id);
                        return (
                            <div 
                                key={photo.id} 
                                className="relative aspect-square cursor-pointer group opacity-0 animate-fade-in-up" 
                                style={{ animationDelay: `${idx * 20}ms` }}
                                onClick={() => handleImageSelect(photo)}
                            >
                                <LazyImage src={photo.url} alt="" className="w-full h-full object-cover rounded-md smooth-scaling"/>
                                <div className="absolute top-1 right-1 w-5 h-5 rounded-sm border-2 border-white bg-black/25 flex items-center justify-center">
                                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div className={`absolute inset-0 ring-2 ring-offset-2 ring-indigo-500 rounded-md transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}></div>
                                <button onClick={(e) => { e.stopPropagation(); setPreviewImage(photo); }} className="absolute bottom-1 right-1 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100" title="Увеличить">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
                {isLoadingPhotos && photos.length > 0 && <div className="flex justify-center mt-4 col-span-full"><div className="loader"></div></div>}
                {hasMore && !isLoadingPhotos && <div ref={loadMoreRef} className="h-1 col-span-full"></div>}
            </>
        );
    };
    
    const renderAlbumContent = () => {
        if (isLoadingAlbums) return <AlbumSkeleton />;
        if (albumError) return <div className="text-sm text-red-600">{albumError}</div>;
    
        return (
            <div className="flex flex-wrap items-center gap-2">
                {albums.map(album => (
                    <button
                        key={album.id}
                        onClick={() => handleSelectAlbum(album.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-400"
                    >
                        <span className="whitespace-nowrap">{album.name}</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap bg-gray-200 text-gray-700">
                            {album.size}
                        </span>
                    </button>
                ))}

                {albums.length === 0 && !isLoadingAlbums && <p className="text-sm text-gray-500 mr-2">Альбомы не найдены.</p>}
    
                <button
                    type="button"
                    onClick={() => setIsCreateAlbumModalOpen(true)}
                    disabled={isLoadingAlbums}
                    title="Создать новый альбом"
                    className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50"
                >
                    + Создать альбом
                </button>
                <button
                    onClick={() => fetchAlbums(true)}
                    disabled={isLoadingAlbums}
                    title="Обновить список альбомов из VK"
                    className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isLoadingAlbums ? <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                </button>
            </div>
        );
    };

    return (
        <div className="mt-4 border-t pt-4 animate-fade-in-up">
            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className={`flex flex-col flex-grow overflow-hidden border rounded-lg ${selectedAlbumId ? 'h-[50vh] min-h-[400px]' : ''}`}>
                <header className="p-3 border-b bg-gray-50 flex-shrink-0">
                    <div className="flex border-b">
                        <button onClick={() => setTab('project')} className={`px-4 py-2 text-sm font-medium flex-1 ${tab === 'project' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Проект</button>
                        <button onClick={() => setTab('agency')} className={`px-4 py-2 text-sm font-medium flex-1 ${tab === 'agency' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'}`}>Агентство</button>
                    </div>
                </header>
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className={`transition-all duration-500 ease-in-out ${selectedAlbumId ? 'max-h-0 opacity-0' : 'max-h-full opacity-100'}`}>
                         <div className="p-4 border-b">
                            {renderAlbumContent()}
                        </div>
                    </div>
                    
                     <div className={`flex flex-col flex-1 transition-all duration-500 ease-in-out overflow-hidden ${selectedAlbumId ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                        {selectedAlbumId && (
                             <div className="sticky top-0 grid grid-cols-[auto_1fr_auto] items-center p-3 border-b bg-gray-50/80 backdrop-blur-sm flex-shrink-0 z-10 gap-4">
                                <div className="justify-self-start">
                                    <button onClick={handleBackToAlbums} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                         Альбомы
                                    </button>
                                </div>
                                <div className="justify-self-center">
                                    <button onClick={() => onAddImages(selection)} disabled={selection.length === 0} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white disabled:bg-gray-400">
                                        Добавить {selection.length > 0 ? `(${selection.length})` : ''} фото
                                    </button>
                                </div>
                                <div className="justify-self-end flex items-center gap-2">
                                    <div className="flex items-center p-0.5 bg-gray-200 rounded-md">
                                        {[3, 4, 5].map(size => (
                                            <button key={size} onClick={() => setGridSize(size)} title={`Сетка ${size}x${size}`} className={`p-2 rounded ${gridSize === size ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                                                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                  {Array.from({length: size * size}).map((_, i) => {
                                                    const col = i % size;
                                                    const row = Math.floor(i / size);
                                                    const s = 16/size;
                                                    const gap = s > 4 ? 1.5 : 1;
                                                    return <rect key={i} x={col * s + gap/2} y={row * s + gap/2} width={s - gap} height={s - gap} rx="1"/>
                                                  })}
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">Загрузить фото</button>
                                    <button onClick={() => handleRefreshPhotos(selectedAlbumId)} disabled={isLoadingPhotos} title="Обновить фотографии из VK" className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-wait">
                                        {isLoadingPhotos ? <div className="loader h-5 w-5 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                                    </button>
                                </div>
                            </div>
                        )}
                        <main 
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="relative flex-1 p-4 overflow-y-auto custom-scrollbar transition-all duration-200 rounded-b-lg"
                        >
                             {selectedAlbumId && renderPhotoContent()}
                             {isDraggingOver && (
                                <div 
                                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 bg-indigo-100 bg-opacity-75 border-2 border-dashed border-indigo-500 rounded-lg"
                                >
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm font-semibold text-indigo-700">
                                            Загрузить в альбом "{selectedAlbum?.name}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            
            {previewImage && (
                <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)}>
                    <button 
                        onClick={() => handleImageSelect(previewImage!)} 
                        className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-lg text-white shadow-lg transition-colors ${selection.some(p => p.id === previewImage!.id) ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {selection.some(p => p.id === previewImage!.id) ? '✓ Убрать' : 'Выбрать'}
                    </button>
                </ImagePreviewModal>
            )}

            {isCreateAlbumModalOpen && (
                <CreateAlbumModal
                    projectId={projectId}
                    onClose={() => setIsCreateAlbumModalOpen(false)}
                    onSuccess={() => {
                        setIsCreateAlbumModalOpen(false);
                        fetchAlbums(true); // Принудительно обновляем список альбомов
                    }}
                />
            )}
            
             {filesToConfirm.length > 0 && (
                <UploadConfirmationModal
                    fileCount={filesToConfirm.length}
                    uploadTargetName={`альбом "${selectedAlbum?.name || ''}"`}
                    onConfirm={handleConfirmUpload}
                    onCancel={() => setFilesToConfirm([])}
                />
            )}
        </div>
    );
};