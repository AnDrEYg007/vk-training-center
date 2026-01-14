import React, { useState } from 'react';
import { PhotoAttachment } from '../../../shared/types';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';

interface EditableImageGridProps {
    images: PhotoAttachment[];
    isEditing: boolean;
    onRemoveImage: (id: string) => void;
}

export const EditableImageGrid: React.FC<EditableImageGridProps> = ({ images, isEditing, onRemoveImage }) => {
    const [previewImage, setPreviewImage] = useState<PhotoAttachment | null>(null);
    
    // Этот компонент теперь не рендерит ничего, если нет изображений,
    // так как состояние "нет изображений" обрабатывается в PostMediaSection.
    if (images.length === 0) {
        return null;
    }

    return (
        <>
            {images.map((img) => (
                <div key={img.id} className="relative aspect-square group cursor-pointer animate-fade-in-up" onClick={() => setPreviewImage(img)}>
                    <img src={img.url} className="w-full h-full object-cover rounded"/>
                    {isEditing && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onRemoveImage(img.id); }}
                            className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            &times;
                        </button>
                    )}
                </div>
            ))}
            
            {previewImage && (
                <ImagePreviewModal
                    image={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </>
    );
};