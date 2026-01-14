
import React, { useState, useRef, useEffect, useCallback, DragEvent } from 'react';
import { createPortal } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import * as api from '../../../../services/api';
import { PhotoAttachment, Attachment, Photo } from '../../../../shared/types';
import { AttachmentsDisplay } from '../AttachmentsDisplay';
import { ImageGallery } from '../ImageGallery';
import { UploadConfirmationModal } from './UploadConfirmationModal';
import { ImagePreviewModal } from '../../../../shared/components/modals/ImagePreviewModal';

type UploadStatus = 'uploading' | 'completed' | 'failed';

interface UploadingFile {
  // Временный ID для отслеживания процесса загрузки
  tempId: string; 
  status: UploadStatus;
  file: File; 
  error?: string;
}

// Компонент для отображения одного элемента сетки медиа
const MediaGridItem: React.FC<{
    imageUrl: string;
    isEditing: boolean;
    onRemove: () => void;
    onClick?: () => void;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: () => void;
    // DnD props
    onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}> = ({ imageUrl, isEditing, onRemove, onClick, onMouseEnter, onMouseLeave, onDragStart, onDragOver, onDrop }) => {
    return (
        <div
            className={`relative aspect-square group animate-fade-in-up ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            draggable={isEditing}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <img src={imageUrl} className="w-full h-full object-cover rounded" alt="media content"/>
            
            {isEditing && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Remove image"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

const UploadingGridItem: React.FC<{ item: UploadingFile }> = ({ item }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
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


// Новый компонент для предпросмотра изображения при наведении
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


interface PostMediaSectionProps {
    mode: 'view' | 'edit' | 'copy';
    editedImages: PhotoAttachment[];
    onImagesChange: React.Dispatch<React.SetStateAction<PhotoAttachment[]>>;
    onUploadStateChange: (isUploading: boolean) => void;
    postAttachments: Attachment[];
    editedAttachments: Attachment[];
    onAttachmentsChange: React.Dispatch<React.SetStateAction<Attachment[]>>;
    projectId: string;
    collapsible?: boolean; // Новый проп для компактного режима
}

export const PostMediaSection: React.FC<PostMediaSectionProps> = ({
    mode,
    editedImages,
    onImagesChange,
    onUploadStateChange,
    postAttachments,
    editedAttachments,
    onAttachmentsChange,
    projectId,
    collapsible = false,
}) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditable = mode === 'edit' || mode === 'copy';

    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [filesToConfirm, setFilesToConfirm] = useState<File[]>([]);
    const dragCounter = useRef(0);
    
    // Состояние для сортировки (индекс перетаскиваемого элемента)
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
    
    const [previewImage, setPreviewImage] = useState<PhotoAttachment | null>(null);

    const [hoveredImage, setHoveredImage] = useState<{ url: string; rect: DOMRect } | null>(null);
    const [isExitingPreview, setIsExitingPreview] = useState(false);
    const exitTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const currentlyUploading = uploadingFiles.some(f => f.status === 'uploading');
        onUploadStateChange(currentlyUploading);
    }, [uploadingFiles, onUploadStateChange]);


    const uploadFiles = useCallback((files: File[]) => {
        files.forEach(file => {
            const tempId = uuidv4();
            const newUpload: UploadingFile = { tempId, status: 'uploading', file };
            
            setUploadingFiles(prev => [...prev, newUpload]);

            api.uploadPhoto(file, projectId)
                .then(newPhotoAttachment => {
                    onImagesChange(prev => [...prev, newPhotoAttachment]);
                    setUploadingFiles(prev => prev.filter(f => f.tempId !== tempId));
                })
                .catch(error => {
                    const errorMessage = error instanceof Error ? error.message : 'Ошибка';
                    setUploadingFiles(prev => prev.map(f => 
                        f.tempId === tempId 
                          ? { ...f, status: 'failed', error: errorMessage }
                          : f
                    ));
                    setTimeout(() => {
                        setUploadingFiles(prev => prev.filter(f => f.tempId !== tempId));
                    }, 5000);
                });
        });
    }, [projectId, onImagesChange]);


    const handleAddImagesFromGallery = (photos: Photo[]) => {
        onImagesChange(currentImages => {
            const existingIds = new Set(currentImages.map(img => img.id));
            const newAttachments: PhotoAttachment[] = photos
                .map(photo => ({ id: `photo${photo.id}`, url: photo.url, type: 'photo' as const }))
                .filter(attachment => !existingIds.has(attachment.id));

            return [...currentImages, ...newAttachments];
        });
        setIsGalleryOpen(false);
    };
    
    const handleRemoveItem = (idToRemove: string) => {
        onImagesChange(prev => prev.filter(item => item.id !== idToRemove));
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;
        uploadFiles(files);
        if (event.target) event.target.value = '';
    };

    // --- ОБРАБОТЧИКИ DND ДЛЯ ЗАГРУЗКИ ФАЙЛОВ ---
    const handleContainerDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        // Если мы перетаскиваем внутренний элемент (картинку), не включаем режим загрузки
        if (draggedImageIndex !== null) return;
        
        dragCounter.current++;
        if (isEditable && e.dataTransfer.items?.length > 0) setIsDraggingOver(true);
    };

    const handleContainerDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (draggedImageIndex !== null) return;

        dragCounter.current--;
        if (dragCounter.current === 0) setIsDraggingOver(false);
    };

    const handleContainerDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
    };

    const handleContainerDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (draggedImageIndex !== null) return; // Если это сортировка, игнорируем дроп контейнера

        dragCounter.current = 0;
        if (!isEditable) return;
        setIsDraggingOver(false);
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file: File) => file.type.startsWith('image/'));
        if (droppedFiles.length > 0) setFilesToConfirm(droppedFiles);
    };
    
    const handleConfirmUpload = () => {
        uploadFiles(filesToConfirm);
        setFilesToConfirm([]);
    };

    // --- ОБРАБОТЧИКИ DND ДЛЯ СОРТИРОВКИ КАРТИНОК ---
    const handleItemDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedImageIndex(index);
        // Необходимый хак для Firefox, чтобы drag работал
        e.dataTransfer.effectAllowed = "move"; 
        // e.dataTransfer.setData("text/plain", String(index)); // Можно передавать индекс
    };

    const handleItemDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        // Можно добавить визуальный эффект (например, смещение)
    };

    const handleItemDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        e.stopPropagation();

        if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
            setDraggedImageIndex(null);
            return;
        }

        const newImages = [...editedImages];
        const [movedItem] = newImages.splice(draggedImageIndex, 1);
        newImages.splice(targetIndex, 0, movedItem);

        onImagesChange(newImages);
        setDraggedImageIndex(null);
    };

    // --- ЛОГИКА ОТОБРАЖЕНИЯ (КОМПАКТНЫЙ РЕЖИМ) ---
    const totalItems = editedImages.length + uploadingFiles.length;
    const COLLAPSE_LIMIT = 4;
    const shouldCollapse = collapsible && !isExpanded && totalItems > COLLAPSE_LIMIT;
    const hiddenCount = totalItems - (COLLAPSE_LIMIT - 1);
    
    // Глобальный индекс для сквозного рендеринга обоих массивов
    let globalRenderIndex = 0;

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />
            
            <div 
                onDragEnter={handleContainerDragEnter}
                onDragLeave={handleContainerDragLeave}
                onDragOver={handleContainerDragOver}
                onDrop={handleContainerDrop}
                className="relative p-2 rounded-lg"
            >
                <AttachmentsDisplay 
                    mode={mode} 
                    attachments={isEditable ? editedAttachments : postAttachments} 
                    onRemoveAttachment={(id) => onAttachmentsChange(prev => prev.filter(a => a.id !== id))} 
                />
                
                <div>
                     <div className="flex justify-between items-end mb-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Изображения ({editedImages.length})</label>
                            {isEditable && editedImages.length > 1 && (
                                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1 select-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                    </svg>
                                    Можно менять порядок перетаскиванием
                                </p>
                            )}
                        </div>
                        {isEditable && (
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">Загрузить</button>
                                <button type="button" onClick={() => setIsGalleryOpen(prev => !prev)} className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200">{isGalleryOpen ? 'Скрыть галерею' : 'Добавить фото'}</button>
                            </div>
                        )}
                     </div>
                     
                     {isEditable ? (
                         <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {editedImages.map((item, index) => {
                                const currentIndex = globalRenderIndex++;
                                if (shouldCollapse && currentIndex >= COLLAPSE_LIMIT) return null;
                                const isOverlay = shouldCollapse && currentIndex === COLLAPSE_LIMIT - 1;

                                return (
                                    <div key={item.id} className="relative w-full h-full">
                                        <MediaGridItem 
                                            imageUrl={item.url}
                                            isEditing={isEditable}
                                            onRemove={() => handleRemoveItem(item.id)}
                                            onClick={() => setPreviewImage(item)}
                                            // DnD props
                                            onDragStart={(e) => handleItemDragStart(e, index)}
                                            onDragOver={(e) => handleItemDragOver(e, index)}
                                            onDrop={(e) => handleItemDrop(e, index)}
                                        />
                                        {isOverlay && (
                                            <div 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(true); }}
                                                className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-black/50 transition-colors z-20 backdrop-blur-[1px]"
                                                title="Показать все фото"
                                            >
                                                +{hiddenCount}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {uploadingFiles.map((item) => {
                                const currentIndex = globalRenderIndex++;
                                if (shouldCollapse && currentIndex >= COLLAPSE_LIMIT) return null;
                                const isOverlay = shouldCollapse && currentIndex === COLLAPSE_LIMIT - 1;

                                return (
                                    <div key={item.tempId} className="relative w-full h-full">
                                        <UploadingGridItem item={item} />
                                         {isOverlay && (
                                            <div 
                                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(true); }}
                                                className="absolute inset-0 bg-black/60 rounded flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-black/50 transition-colors z-20 backdrop-blur-[1px]"
                                            >
                                                +{hiddenCount}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                     ) : editedImages.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-2 py-4">
                            {editedImages.map((img, index) => (
                                <div
                                    key={img.id}
                                    className="relative h-28 w-28 rounded-lg shadow-md cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
                                    onClick={() => setPreviewImage(img)}
                                    onMouseEnter={(e) => {
                                        if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
                                        setIsExitingPreview(false);
                                        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                                        setHoveredImage({ url: img.url, rect });
                                    }}
                                    onMouseLeave={() => {
                                        setIsExitingPreview(true);
                                        exitTimeoutRef.current = window.setTimeout(() => {
                                            setHoveredImage(null);
                                            setIsExitingPreview(false);
                                        }, 300);
                                    }}
                                >
                                    <img src={img.url} alt={`Post image ${index + 1}`} className="w-full h-full object-cover rounded-lg border-2 border-white" />
                                </div>
                            ))}
                        </div>
                     ) : null}
                     
                     {!isGalleryOpen && editedImages.length === 0 && uploadingFiles.length === 0 && (
                        <div className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-md text-center">
                            Изображения не добавлены
                            {isEditable && <span className="block text-xs mt-1">Перетащите файлы сюда или используйте кнопки выше</span>}
                        </div>
                     )}

                     {/* Кнопка "Свернуть" */}
                     {collapsible && isExpanded && totalItems > COLLAPSE_LIMIT && (
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
                     
                     {isGalleryOpen && <ImageGallery projectId={projectId} onAddImages={handleAddImagesFromGallery} />}
                </div>

                {isDraggingOver && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-500 bg-indigo-100 bg-opacity-75">
                        <div className="text-center">
                             <svg className="mx-auto h-12 w-12 text-indigo-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-indigo-700">Перетащите файлы для загрузки</p>
                        </div>
                    </div>
                )}
            </div>
            
            {filesToConfirm.length > 0 && (
                <UploadConfirmationModal
                    fileCount={filesToConfirm.length}
                    uploadTargetName="к публикации"
                    onConfirm={handleConfirmUpload}
                    onCancel={() => setFilesToConfirm([])}
                />
            )}

            {previewImage && (
                <ImagePreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
            )}
            
            {hoveredImage && <HoverPreview url={hoveredImage.url} rect={hoveredImage.rect} isExiting={isExitingPreview} />}
        </>
    );
};
