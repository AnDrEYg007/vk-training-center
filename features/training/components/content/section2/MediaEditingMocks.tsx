import React, { useState, DragEvent } from 'react';

// =====================================================================
// Mock-компоненты для страницы "Работа с медиа"
// =====================================================================

// Компонент: Три способа загрузки изображений
export const MediaUploadMethodsDemo: React.FC = () => {
    const [images, setImages] = useState<string[]>([
        'https://picsum.photos/seed/media-1/200/200',
        'https://picsum.photos/seed/media-2/200/200',
    ]);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const handleAddImage = () => {
        setImages([...images, `https://picsum.photos/seed/media-${images.length + 1}/200/200`]);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            {/* Кнопки загрузки */}
            <div className="flex items-center gap-2 mb-4">
                <button 
                    onClick={handleAddImage}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                >
                    Загрузить
                </button>
                <button 
                    onClick={() => setIsGalleryOpen(!isGalleryOpen)}
                    className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                >
                    {isGalleryOpen ? 'Скрыть галерею' : 'Добавить фото'}
                </button>
            </div>

            {/* Сетка изображений */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square group">
                        <img src={img} className="w-full h-full object-cover rounded" alt={`Изображение ${idx + 1}`} />
                        <button 
                            onClick={() => setImages(images.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>

            {/* Подсказка о Drag & Drop */}
            <div className="mt-3 text-xs text-gray-500 text-center">
                Или перетащите файлы сюда мышкой
            </div>

            {/* Mock галерея */}
            {isGalleryOpen && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Галерея VK</p>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            onClick={handleAddImage}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                        >
                            Альбом 1 <span className="ml-1 text-gray-500">12</span>
                        </button>
                        <button 
                            onClick={handleAddImage}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                        >
                            Альбом 2 <span className="ml-1 text-gray-500">8</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент: Drag & Drop с визуализацией
export const DragDropOverlayDemo: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragCounter(prev => prev + 1);
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const newCounter = dragCounter - 1;
        setDragCounter(newCounter);
        if (newCounter === 0) setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragCounter(0);
        setIsDragging(false);
    };

    return (
        <div 
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 transition-all"
        >
            <div className="text-center text-gray-500">
                <p className="text-sm">Перетащите изображения сюда</p>
                <p className="text-xs mt-1">Поддерживаются форматы: JPG, PNG, GIF, WEBP</p>
            </div>

            {/* Overlay при перетаскивании */}
            {isDragging && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-100 bg-opacity-75">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm font-semibold text-indigo-700">Перетащите файлы для загрузки</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент: Галерея альбомов VK
export const ImageGalleryDemo: React.FC = () => {
    const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);

    const albums = [
        { id: 1, name: 'Фото со стены', size: 24 },
        { id: 2, name: 'Товары', size: 18 },
        { id: 3, name: 'Конкурсы', size: 12 },
    ];

    const photos = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/seed/gallery-${i}/200/200`
    }));

    const togglePhoto = (id: number) => {
        setSelectedPhotos(prev => 
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Вкладки */}
            <div className="flex border-b">
                <button className="flex-1 px-4 py-2 text-sm font-medium border-b-2 border-indigo-500 text-indigo-600">
                    Проект
                </button>
                <button className="flex-1 px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-500">
                    Агентство
                </button>
            </div>

            {/* Список альбомов */}
            {!selectedAlbum && (
                <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                        {albums.map(album => (
                            <button
                                key={album.id}
                                onClick={() => setSelectedAlbum(album.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-300 hover:bg-gray-50 hover:border-indigo-400 text-gray-700"
                            >
                                {album.name} <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200">{album.size}</span>
                            </button>
                        ))}
                        <button className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full border-blue-400 text-blue-600 bg-white hover:bg-blue-50">
                            + Создать альбом
                        </button>
                    </div>
                </div>
            )}

            {/* Фотографии альбома */}
            {selectedAlbum && (
                <div className="p-4">
                    {/* Заголовок */}
                    <div className="flex items-center justify-between mb-3">
                        <button 
                            onClick={() => { setSelectedAlbum(null); setSelectedPhotos([]); }}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                            ← Альбомы
                        </button>
                        <button 
                            disabled={selectedPhotos.length === 0}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white disabled:bg-gray-400"
                        >
                            Добавить {selectedPhotos.length > 0 ? `(${selectedPhotos.length})` : ''} фото
                        </button>
                    </div>

                    {/* Сетка фотографий */}
                    <div className="grid grid-cols-3 gap-3">
                        {photos.map(photo => {
                            const isSelected = selectedPhotos.includes(photo.id);
                            return (
                                <div 
                                    key={photo.id}
                                    onClick={() => togglePhoto(photo.id)}
                                    className="relative aspect-square cursor-pointer group"
                                >
                                    <img src={photo.url} className="w-full h-full object-cover rounded-md" alt="" />
                                    
                                    {/* Чекбокс */}
                                    <div className="absolute top-1 right-1 w-5 h-5 rounded-sm border-2 border-white bg-black/25 flex items-center justify-center">
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Кольцо выделения */}
                                    {isSelected && (
                                        <div className="absolute inset-0 ring-2 ring-offset-2 ring-indigo-500 rounded-md"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент: Состояния загрузки
export const UploadStatesDemo: React.FC = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Состояния загрузки:</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {/* Обычное изображение */}
                <div className="relative aspect-square group">
                    <img src="https://picsum.photos/seed/state-1/200/200" className="w-full h-full object-cover rounded" alt="Готово" />
                    <button className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        &times;
                    </button>
                </div>

                {/* Загрузка */}
                <div className="relative aspect-square">
                    <img src="https://picsum.photos/seed/state-2/200/200" className="w-full h-full object-cover rounded opacity-50" alt="Загрузка" />
                    <div className="absolute inset-0 rounded flex items-center justify-center bg-black/50">
                        <div className="loader border-white border-t-transparent"></div>
                    </div>
                </div>

                {/* Ошибка */}
                <div className="relative aspect-square">
                    <img src="https://picsum.photos/seed/state-3/200/200" className="w-full h-full object-cover rounded opacity-50" alt="Ошибка" />
                    <div className="absolute inset-0 rounded flex items-center justify-center bg-red-800/80 text-white">
                        <div className="text-center p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs mt-1">Ошибка</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Компонент: Компактный режим с оверлеем "+N"
export const CompactModeDemo: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const images = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/seed/compact-${i}/200/200`);
    const displayImages = isExpanded ? images : images.slice(0, 3);
    const hiddenCount = images.length - 3;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-gray-700">Изображения ({images.length})</label>
                {!isExpanded && hiddenCount > 0 && (
                    <span className="text-xs text-gray-500">Компактный режим</span>
                )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {displayImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                        <img src={img} className="w-full h-full object-cover rounded" alt={`Изображение ${idx + 1}`} />
                    </div>
                ))}

                {/* Оверлей "+N" */}
                {!isExpanded && hiddenCount > 0 && (
                    <div 
                        onClick={() => setIsExpanded(true)}
                        className="relative aspect-square bg-black/60 rounded flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-black/50 transition-colors backdrop-blur-[1px]"
                        title="Показать все фото"
                    >
                        +{hiddenCount}
                    </div>
                )}
            </div>

            {isExpanded && (
                <button 
                    onClick={() => setIsExpanded(false)}
                    className="text-xs text-indigo-600 mt-2 hover:underline font-medium flex items-center gap-1 ml-auto"
                >
                    Свернуть
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// Компонент: Изменение порядка drag & drop
export const ReorderDemo: React.FC = () => {
    const [images, setImages] = useState([
        'https://picsum.photos/seed/reorder-1/200/200',
        'https://picsum.photos/seed/reorder-2/200/200',
        'https://picsum.photos/seed/reorder-3/200/200',
        'https://picsum.photos/seed/reorder-4/200/200',
    ]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) {
            setDraggedIndex(null);
            return;
        }

        const newImages = [...images];
        const [movedItem] = newImages.splice(draggedIndex, 1);
        newImages.splice(targetIndex, 0, movedItem);
        setImages(newImages);
        setDraggedIndex(null);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                Можно менять порядок перетаскиванием
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        className={`relative aspect-square cursor-move group ${draggedIndex === idx ? 'opacity-50' : ''}`}
                    >
                        <img src={img} className="w-full h-full object-cover rounded" alt={`Изображение ${idx + 1}`} />
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-400 rounded transition-colors"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
